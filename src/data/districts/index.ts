/**
 * District / locality landing pages (programmatic local SEO).
 *
 * Each district ships ≥ 800 words of UNIQUE content per locale (intro + two
 * sections + FAQ) so Google treats every page as distinct, not a doorway clone.
 * Bodies may contain the tokens `{km}` and `{price}` — they are replaced with
 * the live build-time estimate so the prose always matches the calculator.
 *
 * Plant names are never mentioned (kept anonymous, like the rest of the site).
 *
 * To add a locality: create `src/data/districts/<slug>.ts` exporting a
 * `District` (copy an existing file as a template, fill `content` per locale),
 * then import it below and append it to DISTRICTS.
 */
import type { District } from "./types";
import { botanica } from "./botanica";
import { centru } from "./centru";
import { ciocana } from "./ciocana";
import { buiucani } from "./buiucani";
import { riscani } from "./riscani";
import { codru } from "./codru";
import { durlesti } from "./durlesti";
import { vatra } from "./vatra";
import { stauceni } from "./stauceni";
import { bacioi } from "./bacioi";
import { sangera } from "./sangera";
import { cricova } from "./cricova";
import { ghidighici } from "./ghidighici";
import { truseni } from "./truseni";
import { gratiesti } from "./gratiesti";
import { ialoveni } from "./ialoveni";
import { straseni } from "./straseni";
import { aneniiNoi } from "./anenii-noi";

export type { District, DistrictContent } from "./types";

// Chișinău sectors first, then municipality suburbs/towns, then raion towns.
export const DISTRICTS: District[] = [
  botanica,
  centru,
  ciocana,
  buiucani,
  riscani,
  codru,
  durlesti,
  vatra,
  stauceni,
  bacioi,
  sangera,
  cricova,
  ghidighici,
  truseni,
  gratiesti,
  ialoveni,
  straseni,
  aneniiNoi,
];

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}

export const DISTRICT_SLUGS = DISTRICTS.map((d) => d.slug);
