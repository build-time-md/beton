import type { ConcreteStation, DeliveryPlan, LatLng, StationOption } from "./types";
import { table, route } from "./osrm";
import { estimateOrder } from "./pricing";
import { priceFor, GRADES, type ConcreteGrade } from "./concrete";

/**
 * Pick the concrete station and build the full delivery route.
 *
 * By default the station is the one closest to the client by the loaded leg
 * (station -> client): fresh concrete has a limited working time after loading,
 * so minimising that leg is what protects delivery quality. A truck position, if
 * given, only shapes the drawn route (truck -> station -> client) — the truck
 * arrives empty at the plant, so its position never overrides station choice.
 *
 * `preferredId` lets the customer override that pick (they may want a specific
 * plant, e.g. a cheaper grade elsewhere); the nearest plant is still reported as
 * `options[].nearest` so the UI can offer a way back to automatic. An unknown or
 * unreachable preferred id falls back to the nearest rather than failing — the
 * customer still gets a usable quote.
 *
 * The total is concrete (grade × volume) + a flat delivery tariff based on that
 * same loaded leg (see pricing.ts).
 */
export async function planDelivery(
  client: LatLng,
  stations: ConcreteStation[],
  grade: ConcreteGrade | null,
  volume: number,
  truck?: LatLng,
  preferredId?: string,
): Promise<DeliveryPlan> {
  if (stations.length === 0) throw new Error("No stations available");

  const stationPoints: LatLng[] = stations.map((s) => ({ lat: s.lat, lng: s.lng }));

  // station -> client durations (the loaded leg — the only one that matters for
  // freshness). The closest station to the client wins, truck or no truck.
  // Distances come from the same matrix call, and feed the picker's labels.
  const toClient = await table(stationPoints, [client]);
  const stationToClient = toClient.durations.map((row) => row[0]);
  const distToClient = stations.map((_, i) => toClient.distances?.[i]?.[0] ?? null);

  let nearestIdx = -1;
  let bestCost = Infinity;
  for (let i = 0; i < stations.length; i++) {
    const b = stationToClient[i];
    if (b == null) continue;
    if (b < bestCost) {
      bestCost = b;
      nearestIdx = i;
    }
  }

  if (nearestIdx < 0 || !Number.isFinite(bestCost)) {
    throw new Error("No reachable station found for the given location");
  }

  // Honour the customer's pick only if it exists and is actually reachable;
  // otherwise silently fall back to the nearest plant. /api/plan is a public
  // POST endpoint, so parse strictly: Number() would coerce "", " " and "\n"
  // to 0 and quietly load from the first plant instead of the nearest one.
  const preferredIdx =
    preferredId != null && /^\d+$/.test(preferredId) ? Number(preferredId) : -1;
  const forced =
    preferredIdx >= 0 &&
    preferredIdx < stations.length &&
    preferredIdx !== nearestIdx &&
    stationToClient[preferredIdx] != null;

  const bestIdx = forced ? preferredIdx : nearestIdx;

  // Anonymous picker data: opaque index + the facts a customer chooses on.
  // Ordered by DRIVING TIME, the same metric that picks the default plant — so
  // the one flagged `nearest` is always first and the list stays monotonic in
  // its own ranking metric. Ordering by distance instead would let the flagged
  // plant show more km than the row below it (road distance and travel time
  // disagree often around Chișinău's bypass). Unreachable plants sink last.
  const options: StationOption[] = stations
    .map((s, i) => ({
      id: String(i),
      lat: s.lat,
      lng: s.lng,
      distance: distToClient[i] ?? 0,
      duration: stationToClient[i] ?? 0,
      pricePerM3: grade ? priceFor(s.id, grade.id) : null,
      nearest: i === nearestIdx,
      reachable: stationToClient[i] != null,
    }))
    .sort((a, b) => {
      if (a.reachable !== b.reachable) return a.reachable ? -1 : 1;
      if (a.nearest !== b.nearest) return a.nearest ? -1 : 1;
      return a.duration - b.duration || a.distance - b.distance;
    });

  const station = stations[bestIdx];
  const stationPoint = stationPoints[bestIdx];

  const waypoints: LatLng[] = truck
    ? [truck, stationPoint, client]
    : [stationPoint, client];
  const r = await route(waypoints);

  // "Station" is a neutral sentinel (the UI localizes it) — the real plant name
  // is never sent to the client.
  const legs = truck
    ? [
        { from: "Camion", to: "Station", ...r.legs[0] },
        { from: "Station", to: "Client", ...r.legs[1] },
      ]
    : [{ from: "Station", to: "Client", ...r.legs[0] }];

  // Delivery is a flat tariff on the loaded leg (station -> client), which is
  // always the last leg of the route; concrete adds on top, priced with the
  // chosen plant's own grade prices.
  const loadedLeg = r.legs[r.legs.length - 1];
  const pricePerM3 = grade ? priceFor(station.id, grade.id) : 0;
  const cost = estimateOrder(loadedLeg.distance, grade, pricePerM3, volume);

  // The chosen plant's full grade price list, so the widget shows its real prices
  // without the client ever learning which plant it is.
  const gradePrices = Object.fromEntries(
    GRADES.map((g) => [g.id, priceFor(station.id, g.id)]),
  );

  return {
    // Opaque index (matches page.tsx order) + coordinates only — no real id/name.
    station: { id: String(bestIdx), lat: station.lat, lng: station.lng },
    stationForced: forced,
    options,
    gradePrices,
    legs,
    geometry: r.geometry,
    totalDistance: r.distance,
    totalDuration: r.duration,
    cost,
  };
}
