import type { ConcreteStation, DeliveryPlan, LatLng } from "./types";
import { table, route } from "./osrm";
import { estimateOrder } from "./pricing";
import { priceFor, GRADES, type ConcreteGrade } from "./concrete";

/**
 * Pick the best concrete station and build the full delivery route.
 *
 * The station is ALWAYS the one closest to the client by the loaded leg
 * (station -> client): fresh concrete has a limited working time after loading,
 * so minimising that leg is what protects delivery quality. A truck position, if
 * given, only shapes the drawn route (truck -> station -> client) — the truck
 * arrives empty at the plant, so its position never overrides station choice.
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
): Promise<DeliveryPlan> {
  if (stations.length === 0) throw new Error("No stations available");

  const stationPoints: LatLng[] = stations.map((s) => ({ lat: s.lat, lng: s.lng }));

  // station -> client durations (the loaded leg — the only one that matters for
  // freshness). The closest station to the client wins, truck or no truck.
  const toClient = await table(stationPoints, [client]);
  const stationToClient = toClient.durations.map((row) => row[0]);

  let bestIdx = -1;
  let bestCost = Infinity;
  for (let i = 0; i < stations.length; i++) {
    const b = stationToClient[i];
    if (b == null) continue;
    if (b < bestCost) {
      bestCost = b;
      bestIdx = i;
    }
  }

  if (bestIdx < 0 || !Number.isFinite(bestCost)) {
    throw new Error("No reachable station found for the given location");
  }

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
    gradePrices,
    legs,
    geometry: r.geometry,
    totalDistance: r.distance,
    totalDuration: r.duration,
    cost,
  };
}
