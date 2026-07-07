"use client";

import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/contact";
import Icon from "../Icon";
import PhoneLink from "../PhoneLink";

export default function Cta() {
  const { t } = useI18n();
  return (
    <section className="cta">
      <div className="cta__inner reveal">
        <div>
          <div className="cta__title">{t("cta.title")}</div>
          <div className="cta__text">{t("cta.text")}</div>
        </div>
        <div className="cta__actions">
          <PhoneLink className="cta__btn cta__btn--solid">
            <Icon name="phone" size={18} /> {CONTACT.phone}
          </PhoneLink>
        </div>
      </div>
    </section>
  );
}
