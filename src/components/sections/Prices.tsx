"use client";

import { useI18n } from "@/lib/i18n";
import { GRADES, clientPricePerM3 } from "@/lib/concrete";
import SectionHead from "../SectionHead";
import Icon from "../Icon";

const POPULAR = "M250";

export default function Prices() {
  const { t } = useI18n();
  return (
    <section id="prices" className="section">
      <div className="section__inner reveal">
        <SectionHead title={t("prices.title")} />
        <table className="price-table">
          <thead>
            <tr>
              <th>{t("prices.grade")}</th>
              <th style={{ textAlign: "right" }}>{t("prices.price")}</th>
            </tr>
          </thead>
          <tbody>
            {GRADES.map((g) => (
              <tr key={g.id} className={g.id === POPULAR ? "is-popular" : undefined}>
                <td>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span className="grade-ic">
                      <Icon name="cube" size={20} />
                    </span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700 }}>{g.label}</span>
                        {g.id === POPULAR ? (
                          <span className="pop-badge">{t("prices.popular")}</span>
                        ) : null}
                      </div>
                      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>
                        {t(`grade.${g.id}.use`)}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {clientPricePerM3(g)} {t("calc.perM3")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="section__note">{t("prices.note")}</p>
      </div>
    </section>
  );
}
