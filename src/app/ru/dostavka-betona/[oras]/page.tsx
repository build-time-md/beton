import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DistrictPage from "@/components/DistrictPage";
import { MAP_STATIONS } from "@/data/stations";
import { DISTRICT_SLUGS, getDistrict } from "@/data/districts";
import { metadataForDistrict } from "@/lib/seo";
import { districtPageProps } from "@/lib/district-props";
import { districtServiceSchema, faqSchema } from "@/lib/structured-data";

const LANG = "ru" as const;

export function generateStaticParams() {
  return DISTRICT_SLUGS.map((oras) => ({ oras }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ oras: string }>;
}): Promise<Metadata> {
  const { oras } = await params;
  const d = getDistrict(oras);
  return d ? metadataForDistrict(LANG, d) : {};
}

export default async function Page({ params }: { params: Promise<{ oras: string }> }) {
  const { oras } = await params;
  const props = districtPageProps(LANG, oras);
  if (!props) notFound();
  return (
    <>
      <DistrictPage
        lang={LANG}
        content={props.content}
        center={props.center}
        estimate={props.estimate}
        stations={MAP_STATIONS}
        nearby={props.nearby}
        langHrefs={props.langHrefs}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(districtServiceSchema(LANG, props.district, props.estimate.km)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(props.content.faq)) }}
      />
    </>
  );
}
