import type { ConcreteStation } from "@/lib/types";

/**
 * Concrete (beton) batching stations in / around Chișinău, Moldova.
 *
 * `verified: true`  → coordinates matched to the exact site (house-level).
 * `verified: false` → company/street confirmed, but coordinates approximate
 *                     (street centroid, may be off by 100–400 m) — re-check.
 *
 * Sources: bpm.md, betonservice.md, betonlux.md, construct.md producer
 * directory, Yandex Maps, OSM/Nominatim. Last researched 2026-06-28.
 */
export const STATIONS: ConcreteStation[] = [
  {
    id: "bpm",
    name: "BPM (Beton Produse Moldova)",
    company: "BPM",
    lat: 47.0020675,
    lng: 28.8898313,
    address: "Str. Uzinelor 78, Chișinău",
    phone: "+373 22 480 480",
    website: "https://bpm.md",
    verified: true,
  },
  {
    id: "beton-service",
    name: "Beton Service",
    company: 'S.C. "BETON SERVICE" S.R.L.',
    lat: 47.093384,
    lng: 28.827835,
    address: "Str. George Coșbuc 4, com. Grătiești, Chișinău",
    phone: "+373 69 112463",
    website: "https://betonservice.md",
    verified: true,
  },
  {
    id: "owl-trans",
    name: "OWL Trans (uzină beton)",
    company: "SRL OWL Trans",
    lat: 47.008305,
    lng: 28.87833,
    address: "Str. Uzinelor 12, Chișinău",
    verified: true,
  },
  {
    id: "fec",
    name: "FEC S.A.",
    company: "FEC S.A.",
    lat: 46.9977458,
    lng: 28.8969339,
    address: "Str. Uzinelor 96, Chișinău (sect. Ciocana)",
    phone: "+373 69 139816",
    verified: true,
  },
  {
    id: "fortus",
    name: "FORTUS S.R.L.",
    company: "FORTUS S.R.L.",
    lat: 47.0862186,
    lng: 28.8724533,
    address: "Str. Industrială 4, com. Stăuceni, Chișinău",
    phone: "+373 696 45803",
    verified: true,
  },
  {
    id: "armo-beton",
    name: "ARMO-BETON S.A.",
    company: "ARMO-BETON S.A.",
    lat: 46.9194482,
    lng: 28.8914566,
    address: "Str. Uzinelor 8, com. Băcioi, Chișinău",
    phone: "+373 69 917809",
    verified: true,
  },
  {
    id: "transcon-m",
    name: "TRANSCON-M SA",
    company: "TRANSCON-M SA",
    lat: 47.0717107,
    lng: 28.757383,
    address: "Str. Constructorilor 6, Chișinău (sect. Buiucani)",
    phone: "+373 68 212121",
    verified: true,
  },
  {
    id: "beton-lux",
    name: "BETON-LUX S.R.L.",
    company: "BETON-LUX S.R.L.",
    lat: 47.0703368,
    lng: 28.7622021,
    address: "Str. Constructorilor 7, or. Vatra, Chișinău",
    phone: "+373 22 596566",
    website: "https://www.betonlux.md",
    verified: false,
  },
  {
    id: "marstel-grup",
    name: "MARSTEL GRUP S.R.L.",
    company: "MARSTEL GRUP S.R.L.",
    lat: 47.0020408,
    lng: 28.8900454,
    address: "Str. Uzinelor 78, Chișinău (lângă BPM)",
    phone: "+373 69 429429",
    verified: false,
  },
  {
    id: "euroaccent",
    name: "Euroaccent (uzină de betoane)",
    company: "EUROACCENT S.R.L.",
    lat: 46.9540221,
    lng: 28.7569376,
    address: "Str. Grigore Vieru 34, Ialoveni",
    phone: "+373 60 700800",
    website: "https://euro-accent.md",
    verified: false,
  },
  {
    id: "imix",
    name: "IMIX",
    company: "IMIX",
    lat: 46.8792248,
    lng: 28.7688082,
    address: "or. Costești, r. Ialoveni (șoseaua Ialoveni–Costești)",
    phone: "+373 69 390504",
    website: "https://imix.md",
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
    id: "beton-expert-prim",
    name: "Beton Expert Prim",
    company: "BETON EXPERT PRIM S.R.L.",
    lat: 47.0819169,
    lng: 28.8314797,
    address: "com. Stăuceni, Chișinău",
    verified: true,
  },
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
];

/**
 * Still to locate (no precise public address/coords): Beton.md.
 * Excluded on purpose: Iacobaș Construct (Sîngera) — precast concrete
 * products, not ready-mix for delivery.
 */
