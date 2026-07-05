import { STATIONS } from "@/data/stations";
import { haversine } from "./geo";
import { quoteDelivery } from "./pricing";
import type { LatLng } from "./types";

/**
 * Build-safe delivery estimate for a fixed point (a district centroid).
 *
 * OSRM is NOT reachable at build time, so district pages can't call the live
 * router during SSG. This gives a network-free "de la ~X lei / ~Y km" from the
 * straight-line distance to the nearest plant × a road detour factor.
 *
 * SERVER-ONLY: imports the full STATIONS (names/addresses). Never import into a
 * client component — call it in a Server Component route and pass the result.
 */
const ROAD_FACTOR = 1.3;

export function districtEstimate(point: LatLng): { km: number; price: number } {
  const meters =
    Math.min(...STATIONS.map((s) => haversine(point, { lat: s.lat, lng: s.lng }))) *
    ROAD_FACTOR;
  const q = quoteDelivery(meters);
  return { km: Math.round((meters / 1000) * 10) / 10, price: q.total };
}
