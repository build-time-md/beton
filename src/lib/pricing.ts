import type { ConcreteGrade } from "./concrete";

/**
 * Pricing.
 *
 * Order total = concrete (grade price/m³ × volume) + delivery.
 *
 * Delivery is a FLAT price per trip, decided solely by the one-way ROAD distance
 * from the loading plant (station) to the client — the loaded leg. Grade and
 * volume do NOT affect the delivery part.
 *
 * Delivery tariff (lei), plant -> client distance, PER TRUCK LOAD:
 *   ≤ 5 km ............ 1500
 *   5–10 km ........... 1600
 *   10–15 km .......... 1700
 *   15–20 km .......... 1800
 *   > 20 km ........... 1800 + 80 × each started km over 20
 *
 * One mixer carries at most `truckCapacityM3`; a larger order needs several
 * trips, so the delivery is multiplied by the number of trucks needed.
 */
export const PRICING = {
  currency: "lei",
  /** First band whose `maxKm` is ≥ the distance wins. */
  bands: [
    { maxKm: 5, price: 1500 },
    { maxKm: 10, price: 1600 },
    { maxKm: 15, price: 1700 },
    { maxKm: 20, price: 1800 },
  ],
  /** Beyond the last band: this base + perKmOver × each started km over `overFromKm`. */
  overFromKm: 20,
  overBasePrice: 1800,
  perKmOver: 80,
  /** Max concrete one mixer truck carries per load (m³). Tune to the real fleet. */
  truckCapacityM3: 8,
} as const;

type DeliveryQuote = {
  currency: string;
  /** one-way plant -> client road distance. */
  distanceMeters: number;
  distanceKm: number;
  /** flat total the customer pays. */
  total: number;
  /** band base price (1500…1800). */
  basePrice: number;
  /** whole km beyond `overFromKm` (0 when within 20 km). */
  overKm: number;
  /** lei per km over the limit (80). */
  perKmOver: number;
  /** overKm × perKmOver (0 when within 20 km). */
  overCost: number;
};

/**
 * Flat delivery price for a given plant -> client road distance (meters).
 * Grade and volume are intentionally not parameters — price is distance only.
 */
export function quoteDelivery(distanceMeters: number): DeliveryQuote {
  const km = distanceMeters / 1000;
  const band = PRICING.bands.find((b) => km <= b.maxKm);

  let basePrice: number;
  let overKm = 0;
  if (band) {
    basePrice = band.price;
  } else {
    basePrice = PRICING.overBasePrice;
    // Each started km over the limit is billed in full.
    overKm = Math.ceil(km - PRICING.overFromKm);
  }
  const overCost = overKm * PRICING.perKmOver;

  return {
    currency: PRICING.currency,
    distanceMeters,
    distanceKm: Math.round(km * 10) / 10,
    total: basePrice + overCost,
    basePrice,
    overKm,
    perKmOver: PRICING.perKmOver,
    overCost,
  };
}

export type OrderEstimate = {
  currency: string;
  // Concrete part (0 when no grade selected).
  gradeId: string;
  /** grade label (M250 …) — same across languages */
  gradeLabel: string;
  pricePerM3: number;
  volume: number;
  concreteTotal: number;
  // Delivery part.
  /** Per-trip tariff (flat, by distance). */
  delivery: DeliveryQuote;
  /** Max m³ one mixer carries per trip. */
  truckCapacityM3: number;
  /** Number of trips needed to carry `volume` (≥ 1). */
  trucks: number;
  /** delivery.total × trucks. */
  deliveryTotal: number;
  // Grand total = concreteTotal + deliveryTotal.
  total: number;
};

/**
 * Full order estimate: concrete (per-m³ price × volume) + delivery. The per-m³
 * price is resolved by the caller for the chosen plant (see concrete.priceFor).
 * Delivery is a per-trip tariff on the loaded-leg road distance (meters),
 * multiplied by how many mixer loads the volume needs.
 */
export function estimateOrder(
  distanceMeters: number,
  grade: ConcreteGrade | null,
  pricePerM3: number,
  volume: number,
): OrderEstimate {
  const delivery = quoteDelivery(distanceMeters);
  const concreteTotal = grade ? Math.round(pricePerM3 * volume) : 0;

  // At least one trip; more when the volume exceeds a single mixer load.
  const capacity = PRICING.truckCapacityM3;
  const trucks = Math.max(1, Math.ceil((volume > 0 ? volume : 0) / capacity));
  const deliveryTotal = delivery.total * trucks;

  return {
    currency: PRICING.currency,
    gradeId: grade?.id ?? "",
    gradeLabel: grade?.label ?? "",
    pricePerM3,
    volume,
    concreteTotal,
    delivery,
    truckCapacityM3: capacity,
    trucks,
    deliveryTotal,
    total: concreteTotal + deliveryTotal,
  };
}
