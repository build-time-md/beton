import SiteApp from "@/components/SiteApp";
import { MAP_STATIONS } from "@/data/stations";
import { DISTRICTS } from "@/data/districts";
import { metadataFor, districtPath } from "@/lib/seo";

export const metadata = metadataFor("ru");

export default function HomeRu() {
  const areas = DISTRICTS.map((d) => ({ name: d.name.ru, href: districtPath("ru", d.slug) }));
  return <SiteApp lang="ru" stations={MAP_STATIONS} areas={areas} />;
}
