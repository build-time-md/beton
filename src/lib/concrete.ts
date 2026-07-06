/**
 * Concrete grades and per-plant prices.
 *
 * Prices are the final, customer-facing lei/m³ (no separate markup). They depend
 * on the plant: DEFAULT_PRICES applies to every station, unless the station id
 * has an entry in STATION_PRICES (e.g. Concrete Alliance has its own list).
 */
export type ConcreteGrade = {
  id: string;
  /** Customer-facing label (marca + clasa). */
  label: string;
};

export const GRADES: ConcreteGrade[] = [
  { id: "M150", label: "M150 (C8/10)" },
  { id: "M200", label: "M200 (C12/15)" },
  { id: "M250", label: "M250 (C16/20)" },
  { id: "M300", label: "M300 (C20/25)" },
  { id: "M350", label: "M350 (C25/30)" },
];

/** Default client price per m³ (lei), by grade id — applies to every plant… */
export const DEFAULT_PRICES: Record<string, number> = {
  M150: 1600,
  M200: 1690,
  M250: 1785,
  M300: 1890,
  M350: 1975,
};

/** …except plants that have their own price list, keyed by station id. */
const STATION_PRICES: Record<string, Record<string, number>> = {
  "concrete-alliance": {
    M150: 1550,
    M200: 1650,
    M250: 1750,
    M300: 1850,
    M350: 1950,
  },
};

/** Client price per m³ for a grade at a given station (station override → default). */
export function priceFor(stationId: string, gradeId: string): number {
  return STATION_PRICES[stationId]?.[gradeId] ?? DEFAULT_PRICES[gradeId] ?? 0;
}

// Inițial: niciun beton selectat și 0 m³.
export const DEFAULT_GRADE_ID = "";
export const DEFAULT_VOLUME_M3 = 0;

export function getGrade(id: string): ConcreteGrade | undefined {
  return GRADES.find((g) => g.id === id);
}
