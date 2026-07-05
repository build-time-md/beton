"use client";

import { useI18n } from "@/lib/i18n";
import { GRADES } from "@/lib/concrete";
import { PRICING } from "@/lib/pricing";
import SectionHead from "../SectionHead";
import Icon from "../Icon";

const POPULAR = "M250";

/** Distance tariff rows, built from PRICING so they never drift from the model. */
function tariffRows() {
  const rows = PRICING.bands.map((b, i) => {
    const prev = i === 0 ? 0 : PRICING.bands[i - 1].maxKm;
    const label = i === 0 ? `≤ ${b.maxKm} km` : `${prev}–${b.maxKm} km`;
    return { label, price: `${b.price} ${PRICING.currency}` };
  });
  rows.push({
    label: `> ${PRICING.overFromKm} km`,
    price: `${PRICING.overBasePrice} ${PRICING.currency} + ${PRICING.perKmOver} ${PRICING.currency}/km`,
  });
  return rows;
}

export default function Prices() {
  const { t } = useI18n();
  return (
    <section id="prices" className="section">
      <div className="section__inner reveal">
        <SectionHead title={t("prices.title")} />

        {/* Tarif livrare — după distanța de la stație la client */}
        <table className="price-table">
          <thead>
            <tr>
              <th>{t("prices.distance")}</th>
              <th style={{ textAlign: "right" }}>{t("prices.price")}</th>
            </tr>
          </thead>
          <tbody>
            {tariffRows().map((r) => (
              <tr key={r.label}>
                <td style={{ fontWeight: 700 }}>{r.label}</td>
                <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {r.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="section__note">{t("prices.note")}</p>

        {/* Ghid mărci — informativ, nu influențează prețul */}
        <h3 style={{ margin: "34px 0 14px", fontSize: 18 }}>{t("prices.gradeGuide")}</h3>
        <table className="price-table">
          <thead>
            <tr>
              <th>{t("prices.grade")}</th>
              <th>{t("prices.useCol")}</th>
            </tr>
          </thead>
          <tbody>
            {GRADES.map((g) => (
              <tr key={g.id} className={g.id === POPULAR ? "is-popular" : undefined}>
                <td style={{ whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span className="grade-ic">
                      <Icon name="cube" size={20} />
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700 }}>{g.label}</span>
                      {g.id === POPULAR ? (
                        <span className="pop-badge">{t("prices.popular")}</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>
                  {t(`grade.${g.id}.use`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
