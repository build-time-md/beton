"use client";

import { useI18n } from "@/lib/i18n";

export default function Intro() {
  const { t } = useI18n();
  return (
    <section className="intro">
      <div className="intro__inner reveal">
        <h1 className="intro__title">{t("slogan.title")}</h1>
        <p className="intro__text">{t("slogan.text")}</p>
      </div>
    </section>
  );
}
