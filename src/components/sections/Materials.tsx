"use client";

import { useI18n } from "@/lib/i18n";
import { CONTACT, telHref } from "@/lib/contact";
import Icon from "../Icon";
import SectionHead from "../SectionHead";

// Drop real photos in /public/materials and keep these paths.
const MATERIALS = [
  { icon: "sand", photo: "/materials/nisip.jpg", t: "mat.sand.t", d: "mat.sand.d" },
  { icon: "gravel", photo: "/materials/pietris.jpg", t: "mat.gravel.t", d: "mat.gravel.d" },
];

export default function Materials() {
  const { t } = useI18n();
  return (
    <section id="materials" className="section section--alt">
      <div className="section__inner reveal">
        <SectionHead title={t("mat.title")} />
        <p className="section__sub">{t("mat.subtitle")}</p>

        <div className="materials">
          {MATERIALS.map((m) => (
            <article key={m.icon} className="material-card">
              <div className="material-card__media">
                <span className="material-card__ph" aria-hidden="true">
                  <Icon name={m.icon} size={46} />
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="material-card__img"
                  src={m.photo}
                  alt={t(m.t)}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="material-card__body">
                <h3 className="material-card__title">{t(m.t)}</h3>
                <p className="material-card__desc">{t(m.d)}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="materials-note">
          {t("mat.note")}{" "}
          <a href={telHref} className="materials-note__phone">
            {CONTACT.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
