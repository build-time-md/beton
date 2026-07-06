import type { Lang } from "@/lib/i18n";

export type DistrictContent = {
  title: string; // ≤ 60 chars
  description: string; // ~150 chars
  h1: string;
  intro: string;
  sectionA: { title: string; body: string };
  sectionB: { title: string; body: string };
  faq: { q: string; a: string }[];
};

export type District = {
  slug: string; // shared ascii slug across locales
  lat: number;
  lng: number;
  name: Record<Lang, string>;
  nearby: string[]; // slugs → "localități vecine" links (non-existent ones are ignored)
  content: Record<Lang, DistrictContent>;
};
