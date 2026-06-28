import type { LatLng } from "./types";
import { haversine } from "./geo";
import { MARKUP_PER_M3, type ConcreteGrade } from "./concrete";

/**
 * Delivery (transport) pricing model.
 *
 * In-city  → flat fee.
 * Outside  → base fee + lei/km of road distance from the base/city to the
 *            client (NOT from the nearest station), billed round trip.
 *
 * Returns DATA ONLY (numbers) — all labels/notes are localized in the UI.
 *
 * Numbers are the client's real tariffs where known (in-city = 1700 lei).
 * The per-km rate is a placeholder — confirm and tune here.
 */
export const PRICING = {
  currency: "lei",
  cityCenter: { lat: 47.0105, lng: 28.8638 } as LatLng,
  /** Within this radius of the center = "in city" → flat fee. */
  cityRadiusKm: 8,
  cityFlatFee: 1700,
  baseFeeOutside: 600,
  perKmOutside: 15,
  roundTrip: true,
} as const;

export type DeliveryCost = {
  zone: "city" | "outside";
  total: number;
  /** outside-only details (0 when in city) */
  baseFee: number;
  oneWayKm: number;
  perKm: number;
  roundTrip: boolean;
  kmCost: number;
};

export type OrderEstimate = {
  currency: string;
  volume: number;
  gradeId: string;
  /** grade label (M250 …) — same across languages */
  gradeLabel: string;
  pricePerM3: number;
  concreteTotal: number;
  delivery: DeliveryCost;
  total: number;
};

/** True when the client location is inside the city (flat-fee) zone. */
export function isInCity(client: LatLng): boolean {
  return haversine(client, PRICING.cityCenter) / 1000 <= PRICING.cityRadiusKm;
}

function estimateDelivery(
  client: LatLng,
  baseToClientMeters: number,
): DeliveryCost {
  if (isInCity(client)) {
    return {
      zone: "city",
      total: PRICING.cityFlatFee,
      baseFee: 0,
      oneWayKm: 0,
      perKm: PRICING.perKmOutside,
      roundTrip: PRICING.roundTrip,
      kmCost: 0,
    };
  }
  const oneWayKm = baseToClientMeters / 1000;
  const billableKm = PRICING.roundTrip ? oneWayKm * 2 : oneWayKm;
  const kmCost = Math.round(billableKm * PRICING.perKmOutside);
  return {
    zone: "outside",
    total: PRICING.baseFeeOutside + kmCost,
    baseFee: PRICING.baseFeeOutside,
    oneWayKm,
    perKm: PRICING.perKmOutside,
    roundTrip: PRICING.roundTrip,
    kmCost,
  };
}

/** Full order estimate: concrete (grade × volume, with markup) + delivery. */
export function estimateOrder(
  client: LatLng,
  baseToClientMeters: number,
  grade: ConcreteGrade | null,
  volume: number,
): OrderEstimate {
  const delivery = estimateDelivery(client, baseToClientMeters);
  const pricePerM3 = grade ? grade.factoryPrice + MARKUP_PER_M3 : 0;
  const concreteTotal = grade ? Math.round(pricePerM3 * volume) : 0;
  return {
    currency: PRICING.currency,
    volume,
    gradeId: grade?.id ?? "",
    gradeLabel: grade?.label ?? "",
    pricePerM3,
    concreteTotal,
    delivery,
    total: concreteTotal + delivery.total,
  };
}
