import { STATIONS } from "@/data/stations";
import SiteApp from "@/components/SiteApp";

export default function Home() {
  return <SiteApp stations={STATIONS} />;
}
