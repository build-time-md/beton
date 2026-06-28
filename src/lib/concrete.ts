/**
 * Concrete grades and prices.
 *
 * `factoryPrice` = what we pay the plant per m³ (market estimate, 2025–2026).
 * We resell at factoryPrice + MARKUP_PER_M3. The customer only ever sees the
 * final per-m³ price; the factory price and markup stay internal.
 *
 * TODO: replace factoryPrice with the real prices negotiated with the plants.
 */
export const MARKUP_PER_M3 = 50;

export type ConcreteGrade = {
  id: string;
  /** Customer-facing label (marca + clasa). */
  label: string;
  /** Plant price per m³ (lei), before markup. */
  factoryPrice: number;
};

export const GRADES: ConcreteGrade[] = [
  { id: "M150", label: "M150 (C8/10)", factoryPrice: 1550 },
  { id: "M200", label: "M200 (C12/15)", factoryPrice: 1650 },
  { id: "M250", label: "M250 (C16/20)", factoryPrice: 1750 },
  { id: "M300", label: "M300 (C20/25)", factoryPrice: 1850 },
  { id: "M350", label: "M350 (C25/30)", factoryPrice: 2000 },
];

// Inițial: niciun beton selectat și 0 m³.
export const DEFAULT_GRADE_ID = "";
export const DEFAULT_VOLUME_M3 = 0;

/** Client price per m³ (factory price + markup). */
export function clientPricePerM3(grade: ConcreteGrade): number {
  return grade.factoryPrice + MARKUP_PER_M3;
}

export function getGrade(id: string): ConcreteGrade | undefined {
  return GRADES.find((g) => g.id === id);
}
