import type { ConcreteStation, DeliveryPlan, LatLng } from "./types";
import { table, route } from "./osrm";
import { estimateOrder, isInCity, PRICING } from "./pricing";
import type { ConcreteGrade } from "./concrete";

/**
 * Pick the best concrete station and build the full delivery route.
 *
 * - With a truck position: minimise total driving time truck -> station -> client
 *   (the truck must first reach a station to load, then deliver).
 * - Without a truck: minimise station -> client (closest station to the site),
 *   since fresh concrete has a limited working time after loading.
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

  // station -> client durations (exact direction).
  const toClient = await table(stationPoints, [client]);
  const stationToClient = toClient.durations.map((row) => row[0]);

  let bestIdx = 0;
  let bestCost = Infinity;

  if (truck) {
    // truck -> station durations.
    const fromTruck = await table([truck], stationPoints);
    const truckToStation = fromTruck.durations[0];
    for (let i = 0; i < stations.length; i++) {
      const a = truckToStation[i];
      const b = stationToClient[i];
      if (a == null || b == null) continue;
      const cost = a + b;
      if (cost < bestCost) {
        bestCost = cost;
        bestIdx = i;
      }
    }
  } else {
    for (let i = 0; i < stations.length; i++) {
      const b = stationToClient[i];
      if (b == null) continue;
      if (b < bestCost) {
        bestCost = b;
        bestIdx = i;
      }
    }
  }

  if (!Number.isFinite(bestCost)) {
    throw new Error("No reachable station found for the given location");
  }

  const station = stations[bestIdx];
  const stationPoint = stationPoints[bestIdx];

  const waypoints: LatLng[] = truck
    ? [truck, stationPoint, client]
    : [stationPoint, client];
  const r = await route(waypoints);

  const legs = truck
    ? [
        { from: "Camion", to: station.name, ...r.legs[0] },
        { from: station.name, to: "Client", ...r.legs[1] },
      ]
    : [{ from: station.name, to: "Client", ...r.legs[0] }];

  // Cost: in-city = flat; outside = lei/km of road distance from the base/city
  // to the client (measured directly, independent of the chosen station).
  let baseToClientMeters = 0;
  if (!isInCity(client)) {
    const origin = truck ?? PRICING.cityCenter;
    const direct = await route([origin, client]);
    baseToClientMeters = direct.distance;
  }
  const cost = estimateOrder(client, baseToClientMeters, grade, volume);

  return {
    station,
    legs,
    geometry: r.geometry,
    totalDistance: r.distance,
    totalDuration: r.duration,
    cost,
  };
}
