/**
 * Locality/address geocoding via OpenStreetMap Nominatim.
 *
 * Runs server-side only (called by /api/geocode) so we can set a proper
 * User-Agent — the browser can't, and Nominatim's usage policy requires one.
 * Results are biased to Moldova (countrycodes=md) and localized per UI language.
 *
 * To respect the public Nominatim server we: cache answers in-process (a query
 * is asked once, then served from memory), and the client debounces keystrokes.
 * Point NOMINATIM_URL at a self-hosted instance to drop the external dependency.
 */

import { haversine } from "./geo";

const NOMINATIM_URL =
  process.env.NOMINATIM_URL ?? "https://nominatim.openstreetmap.org";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beton.build-time.net";
// Nominatim asks for an identifiable app + a way to reach the operator.
const USER_AGENT = `beton-map/1.0 (+${SITE_URL})`;
const CONTACT_EMAIL = process.env.GEOCODER_EMAIL ?? "";

export type GeocodeResult = {
  /** Short primary name, e.g. "Trușeni". */
  name: string;
  /** Full disambiguating context, e.g. "Trușeni, Chișinău, Moldova". */
  displayName: string;
  lat: number;
  lng: number;
  /** OSM place kind (village / town / city / hamlet / …). */
  type: string;
};

// jsonv2 result shape (only the fields we read).
type NominatimItem = {
  lat: string;
  lon: string;
  name?: string;
  display_name?: string;
  type?: string;
  addresstype?: string;
};

// Result kinds worth offering as a delivery destination: settlements, admin
// areas (raion/region a user might type), and street-level addresses. Anything
// else Nominatim returns for a name match — rivers, streams, peaks, POIs — is
// dropped so the dropdown stays relevant. Matched against `addresstype`/`type`.
const ALLOWED_TYPES = new Set([
  "city", "town", "village", "hamlet", "suburb", "quarter", "neighbourhood",
  "borough", "locality", "isolated_dwelling", "allotments", "municipality",
  "city_block", "croft",
  "district", "county", "region", "province", "state", "administrative",
  "road", "residential", "pedestrian", "street", "house", "house_number",
  "building", "address", "postcode",
]);

// Actual settlements rank above admin boundaries when collapsing duplicates, so
// the point we keep is the village/town itself rather than a commune centroid.
const SETTLEMENT_TYPES = new Set([
  "city", "town", "village", "hamlet", "suburb", "quarter", "neighbourhood",
  "borough", "locality", "isolated_dwelling",
]);

// Street-level results: distinct streets can share a name, so these are matched
// by name (not merged by proximity like localities).
const ADDRESS_TYPES = new Set([
  "road", "residential", "pedestrian", "street", "house", "house_number",
  "building", "address", "postcode",
]);

// A locality is often returned twice (settlement node + admin boundary) with
// names that differ by language; anything within this radius is treated as the
// same place and collapsed.
const MERGE_RADIUS_M = 4000;

function typeRank(t: string): number {
  if (SETTLEMENT_TYPES.has(t)) return 2;
  return t ? 1 : 0;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch Nominatim with one retry on a transient failure (rate limit / 5xx /
 * network). The public server rate-limits by IP, so a burst can briefly return
 * 429 — retrying once turns that into a hit instead of a false "not found".
 */
async function fetchNominatim(
  url: string,
  lang: string,
): Promise<NominatimItem[]> {
  let lastErr: unknown = new Error("Nominatim unreachable");
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await delay(500);
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, "Accept-Language": lang },
        cache: "no-store",
      });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`Nominatim ${res.status}`);
        continue; // transient — retry
      }
      if (!res.ok) throw new Error(`Nominatim request failed (${res.status})`);
      return (await res.json()) as NominatimItem[];
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Nominatim unreachable");
}

// ── In-process cache: same query is fetched upstream at most once per TTL. ──
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h — locality coordinates are static
const CACHE_MAX = 500;
const cache = new Map<string, { ts: number; data: GeocodeResult[] }>();

function cacheGet(key: string): GeocodeResult[] | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  // Refresh LRU position.
  cache.delete(key);
  cache.set(key, hit);
  return hit.data;
}

function cacheSet(key: string, data: GeocodeResult[]): void {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { ts: Date.now(), data });
}

/**
 * Search Moldovan places/addresses matching `q`, localized to `lang`.
 * Returns up to 6 de-duplicated results, best match first.
 */
export async function searchPlaces(
  q: string,
  lang: string,
): Promise<GeocodeResult[]> {
  const query = q.trim();
  if (query.length < 3) return [];

  const key = `${lang}:${query.toLowerCase()}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    countrycodes: "md",
    "accept-language": lang,
  });
  if (CONTACT_EMAIL) params.set("email", CONTACT_EMAIL);

  const res = await fetch(`${NOMINATIM_URL}/search?${params.toString()}`, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": lang,
    },
    // We keep our own TTL cache; don't let the fetch layer add a second one.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Nominatim request failed (${res.status})`);
  }

  const items = (await res.json()) as NominatimItem[];
  // Kept in Nominatim's importance order. Localities are de-duplicated by
  // proximity (language-independent), so e.g. the Russian UI never shows both
  // "Bardar" and "Бардар"; the settlement point wins over an admin centroid.
  const results: GeocodeResult[] = [];

  for (const it of items) {
    const kind = it.addresstype || it.type || "";
    if (kind && !ALLOWED_TYPES.has(kind)) continue;

    const lat = Number.parseFloat(it.lat);
    const lng = Number.parseFloat(it.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const display = it.display_name ?? "";
    const name = it.name || display.split(",")[0]?.trim() || display;
    if (!name) continue;

    const candidate: GeocodeResult = {
      name,
      displayName: display,
      lat,
      lng,
      type: kind || "place",
    };

    const isAddress = ADDRESS_TYPES.has(candidate.type);
    const dup = isAddress
      ? results.find(
          (r) =>
            ADDRESS_TYPES.has(r.type) &&
            r.name.toLowerCase() === candidate.name.toLowerCase(),
        )
      : results.find(
          (r) =>
            !ADDRESS_TYPES.has(r.type) &&
            haversine(r, candidate) < MERGE_RADIUS_M,
        );

    if (dup) {
      // Same place seen twice — keep the more specific (settlement) point.
      if (typeRank(candidate.type) > typeRank(dup.type)) {
        dup.name = candidate.name;
        dup.displayName = candidate.displayName;
        dup.lat = candidate.lat;
        dup.lng = candidate.lng;
        dup.type = candidate.type;
      }
      continue;
    }
    results.push(candidate);
  }

  cacheSet(key, results);
  return results;
}
