import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/geocode";

export const runtime = "nodejs";

/**
 * GET /api/geocode?q=<text>&lang=<ro|ru|en>
 * Proxies OpenStreetMap Nominatim server-side (see lib/geocode.ts) and returns
 * `{ results: GeocodeResult[] }`. Never throws to the client — on upstream
 * failure it returns an empty list so the search UI degrades gracefully.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const lang = (searchParams.get("lang") ?? "ro").slice(0, 2);

  if (q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchPlaces(q, lang);
    return NextResponse.json(
      { results },
      // Safe to cache: a query maps to fixed coordinates.
      { headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
    );
  } catch (err) {
    const error = err instanceof Error ? err.message : "Geocoding failed";
    return NextResponse.json({ results: [], error }, { status: 502 });
  }
}
