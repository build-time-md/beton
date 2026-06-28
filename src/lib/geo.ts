import type { LatLng } from "./types";

/** Great-circle distance in meters (used only as a cheap fallback / sanity check). */
export function haversine(a: LatLng, b: LatLng): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function isValidLatLng(p: unknown): p is LatLng {
  return (
    !!p &&
    typeof p === "object" &&
    typeof (p as LatLng).lat === "number" &&
    typeof (p as LatLng).lng === "number" &&
    Math.abs((p as LatLng).lat) <= 90 &&
    Math.abs((p as LatLng).lng) <= 180
  );
}
