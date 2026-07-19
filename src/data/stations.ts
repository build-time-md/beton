import type { ConcreteStation, MapStation } from "@/lib/types";

/**
 * Concrete (beton) batching stations in / around Chișinău, Moldova.
 *
 * Curated shortlist — the three suppliers we actually source from.
 *
 * `verified: true`  → coordinates matched to the exact site (house-level).
 * `verified: false` → company/street confirmed, but coordinates approximate
 *                     (street centroid, may be off by 100–400 m) — re-check.
 *
 * Sources: rebuscons.md, directbeton.md, Facebook "Beton Alliance Concrete",
 * construct.md producer directory, Yandex Maps. Last researched 2026-07-04.
 * Beton Expert Prim added 2026-07-19 (Google Maps + OpenStreetMap).
 */
export const STATIONS: ConcreteStation[] = [
  {
    id: "directbeton",
    name: "DirectBeton",
    company: "DirectBeton",
    lat: 46.9981135,
    lng: 28.9091788,
    address: "Str. Uzinelor, sect. Ciocana, Chișinău",
    phone: "+373 78 33 44 00",
    website: "https://www.directbeton.md",
    verified: true,
  },
  {
    id: "rebuscons",
    name: "REBUSCONS",
    company: "REBUSCONS S.R.L.",
    lat: 46.9705866,
    lng: 28.8376358,
    address: "Str. Costiujeni 1/1, or. Codru, Chișinău",
    phone: "+373 69 887460",
    website: "https://www.rebuscons.md",
    verified: true,
  },
  {
    id: "concrete-alliance",
    name: "Concrete Alliance",
    company: "Concrete Alliance",
    // Approximate: Str. Constructorilor concrete cluster in Vatra (same strip as
    // BETON-LUX no. 7 / TRANSCON-M no. 6). Exact building not yet confirmed.
    lat: 47.070318,
    lng: 28.762501,
    address: "Str. Constructorilor, or. Vatra, Chișinău",
    verified: false,
  },
  {
    id: "beton-expert-prim",
    name: "Beton Expert Prim",
    company: "Beton Expert Prim S.R.L.",
    // Google Plus Code 3RJJ+PC -> 8GVC3RJJ+PC -> 47.081813, 28.831063.
    // Corroborated 29 m away by OSM way 1361142235, a fenced landuse=industrial
    // yard named "Fabrica de beton «Beton Expert Prim»" (centroid 47.081887,
    // 28.831434). The site sits on the Stăuceni/Grătiești line by Șos. Balcani
    // (E581) — ~2 km from the str. Ceucari 7 postal address the plant lists.
    lat: 47.081813,
    lng: 28.831063,
    address: "Str. Ceucari 7, com. Stăuceni, Chișinău",
    phone: "+373 606 66 001",
    verified: true,
  },
];

/**
 * Customer-safe stations for the client bundle: opaque index (matches this
 * array's order, which the planner also uses) + coordinates only — no names.
 */
export const MAP_STATIONS: MapStation[] = STATIONS.map((s, i) => ({
  id: String(i),
  lat: s.lat,
  lng: s.lng,
}));
