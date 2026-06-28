import type { LatLng } from "./types";

const OSRM_URL = process.env.OSRM_URL ?? "http://localhost:5000";

/** OSRM expects coordinates as "lng,lat" joined by ";". */
function encodeCoords(points: LatLng[]): string {
  return points.map((p) => `${p.lng},${p.lat}`).join(";");
}

async function osrmFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${OSRM_URL}${path}`, {
    // Routing data is static per deploy; never cache stale upstream errors.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`OSRM request failed (${res.status}): ${path}`);
  }
  const data = (await res.json()) as { code: string } & T;
  if (data.code !== "Ok") {
    throw new Error(`OSRM returned code ${data.code} for ${path}`);
  }
  return data;
}

type TableResponse = {
  durations: (number | null)[][];
  distances?: (number | null)[][];
};

/**
 * Driving-duration matrix between `sources` and `destinations`.
 * Returns durations[sourceIndex][destIndex] in seconds.
 */
export async function table(
  sources: LatLng[],
  destinations: LatLng[],
): Promise<TableResponse> {
  const all = [...sources, ...destinations];
  const sourceIdx = sources.map((_, i) => i).join(";");
  const destIdx = destinations.map((_, i) => i + sources.length).join(";");
  const coords = encodeCoords(all);
  return osrmFetch<TableResponse>(
    `/table/v1/driving/${coords}?sources=${sourceIdx}&destinations=${destIdx}&annotations=duration,distance`,
  );
}

type RouteResponse = {
  routes: {
    distance: number;
    duration: number;
    geometry: { coordinates: [number, number][] };
    legs: { distance: number; duration: number }[];
  }[];
};

/**
 * Driving route through the given waypoints in order.
 * Returns geometry as [lat, lng] pairs (flipped from OSRM's lng,lat).
 */
export async function route(waypoints: LatLng[]): Promise<{
  distance: number;
  duration: number;
  geometry: [number, number][];
  legs: { distance: number; duration: number }[];
}> {
  const coords = encodeCoords(waypoints);
  const data = await osrmFetch<RouteResponse>(
    `/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`,
  );
  const r = data.routes[0];
  if (!r) throw new Error("OSRM returned no route");
  return {
    distance: r.distance,
    duration: r.duration,
    geometry: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    legs: r.legs,
  };
}
