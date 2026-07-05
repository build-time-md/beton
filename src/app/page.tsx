import SiteApp from "@/components/SiteApp";
import { MAP_STATIONS } from "@/data/stations";
import { DISTRICTS } from "@/data/districts";
import { metadataFor, districtPath } from "@/lib/seo";

export const metadata = metadataFor("ro");

export default function Home() {
  const areas = DISTRICTS.map((d) => ({ name: d.name.ro, href: districtPath("ro", d.slug) }));
  return <SiteApp lang="ro" stations={MAP_STATIONS} areas={areas} />;
}
