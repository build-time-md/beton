import SiteApp from "@/components/SiteApp";
import { MAP_STATIONS } from "@/data/stations";
import { DISTRICTS } from "@/data/districts";
import { metadataFor, districtPath } from "@/lib/seo";

export const metadata = metadataFor("en");

export default function HomeEn() {
  const areas = DISTRICTS.map((d) => ({ name: d.name.en, href: districtPath("en", d.slug) }));
  return <SiteApp lang="en" stations={MAP_STATIONS} areas={areas} />;
}
