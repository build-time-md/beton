"use client";

import { useI18n } from "@/lib/i18n";
import Icon from "../Icon";
import SectionHead from "../SectionHead";

const STEPS = [
  { icon: "pin", t: "how.s1.t", d: "how.s1.d" },
  { icon: "calculator", t: "how.s2.t", d: "how.s2.d" },
  { icon: "phone", t: "how.s3.t", d: "how.s3.d" },
];

function FlowLine() {
  return (
    <svg
      className="flow__line"
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flowgrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--brand-dark)" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#flowgrad)" strokeWidth="2.5" strokeLinecap="round">
        {/* segment 1: dip down (icon 1 -> icon 2) */}
        <path d="M250 30 C 330 56, 400 56, 440 32" />
        <path d="M431 26 L 443 32 L 431 38" strokeLinejoin="round" />
        {/* segment 2: arch up (icon 2 -> icon 3) */}
        <path d="M560 28 C 640 4, 712 4, 752 30" />
        <path d="M743 24 L 755 30 L 743 36" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how" className="section section--alt">
      <div className="section__inner reveal">
        <SectionHead title={t("how.title")} />
        <p className="section__sub">{t("how.subtitle")}</p>

        <div className="flow">
          <FlowLine />
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={i} className="step">
                <span className="step__ic">
                  <Icon name={s.icon} size={40} />
                </span>
                <div className="step__title">{t(s.t)}</div>
                <div className="step__desc">{t(s.d)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
