"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ConcreteStation, DeliveryPlan, LatLng } from "@/lib/types";
import type { DeliveryCost } from "@/lib/pricing";
import { GRADES, DEFAULT_GRADE_ID, DEFAULT_VOLUME_M3, clientPricePerM3 } from "@/lib/concrete";
import { useI18n } from "@/lib/i18n";

// Leaflet touches `window`, so the map must render client-side only.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>…</div>,
});

const DEFAULT_CENTER: [number, number] = [
  Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 47.0105),
  Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? 28.8638),
];
const DEFAULT_ZOOM = Number(process.env.NEXT_PUBLIC_DEFAULT_ZOOM ?? 11);

// Baza camionului — FIXĂ, nu poate fi modificată din UI. 47°05'20.7"N 28°41'59.4"E (Cojușna).
const TRUCK_HOME: LatLng = { lat: 47.089083, lng: 28.699833 };
// Locație implicită dacă clientul nu permite accesul la geolocație: Ialoveni.
const FALLBACK_CLIENT: LatLng = { lat: 46.9469, lng: 28.777 };

const fmtKm = (m: number) => `${(m / 1000).toFixed(1)} km`;
const fmtMin = (s: number) => `${Math.round(s / 60)} min`;

type T = (key: string, vars?: Record<string, string | number>) => string;

function deliveryRows(d: DeliveryCost, t: T): { label: string; value: string }[] {
  if (d.zone === "city") return [];
  const km = d.oneWayKm.toFixed(1);
  return [
    { label: t("cost.baseFee"), value: `${d.baseFee} lei` },
    { label: t("cost.distanceOneWay"), value: `${km} km` },
    {
      label: d.roundTrip ? t("cost.transportRound") : t("cost.transportOne"),
      value: d.roundTrip
        ? `2 × ${km} km × ${d.perKm} lei`
        : `${km} km × ${d.perKm} lei`,
    },
    { label: t("cost.kmCost"), value: `${d.kmCost} lei` },
  ];
}

function legName(name: string, t: T): string {
  if (name === "Camion") return t("word.truck");
  if (name === "Client") return t("word.client");
  return name;
}

export default function MapView({ stations }: { stations: ConcreteStation[] }) {
  const { t } = useI18n();
  const [client, setClient] = useState<LatLng | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [gradeId, setGradeId] = useState(DEFAULT_GRADE_ID);
  const [volume, setVolume] = useState(DEFAULT_VOLUME_M3);
  const [plan, setPlan] = useState<DeliveryPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleMapClick(p: LatLng) {
    setUsedFallback(false);
    setClient(p);
  }

  const computePlan = useCallback(async (point: LatLng, gId: string, vol: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: point, truck: TRUCK_HOME, gradeId: gId, volume: vol }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setPlan(data as DeliveryPlan);
    } catch (e) {
      setPlan(null);
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  // La intrarea pe pagină: cere locația. Dacă refuză/eșuează → Ialoveni.
  useEffect(() => {
    if (!navigator.geolocation) {
      setUsedFallback(true);
      setClient(FALLBACK_CLIENT);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUsedFallback(false);
        setClient({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUsedFallback(true);
        setClient(FALLBACK_CLIENT);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  // Recalculează la schimbarea locației, mărcii sau volumului.
  useEffect(() => {
    if (client) computePlan(client, gradeId, volume);
  }, [client, gradeId, volume, computePlan]);

  function requestMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUsedFallback(false);
        setClient({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setError(t("hero.fallback")),
    );
  }

  function scrollToCalc() {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app">
      <div className="app__map">
        <LeafletMap
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          stations={stations}
          client={client}
          truck={TRUCK_HOME}
          chosenStationId={plan?.station.id}
          geometry={plan?.geometry}
          onMapClick={handleMapClick}
        />
        {plan ? (
          <button className="map-pill" onClick={scrollToCalc}>
            <span className="map-pill__price">
              {t("pill.transportTo", { price: plan.cost.delivery.total })}
            </span>
            <span className="map-pill__hint">{t("pill.tap")} ↓</span>
          </button>
        ) : null}
      </div>

      <aside id="calculator" className="app__panel">
        <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 18px" }}>
          {t("hero.intro")}
        </p>

        <button onClick={requestMyLocation} disabled={loading} style={primaryBtn}>
          {loading ? t("hero.calculating") : t("hero.useLocation")}
        </button>

        {usedFallback && client ? (
          <p style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.55, margin: "16px 0 0" }}>
            {t("hero.fallback")}
          </p>
        ) : null}

        <dl style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: "18px 0 0" }}>
          <div>
            {t("hero.yourLocation")}: {client ? coord(client) : t("hero.locating")}
          </div>
        </dl>

        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 18 }}>
          {t("calc.grade")}
        </div>
        <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
          {GRADES.map((g) => {
            const active = g.id === gradeId;
            return (
              <button
                key={g.id}
                onClick={() => setGradeId(active ? "" : g.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${active ? "var(--brand)" : "var(--line)"}`,
                  background: active ? "var(--brand-soft)" : "var(--surface)",
                  color: "var(--ink)",
                  fontWeight: active ? 700 : 400,
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      flexShrink: 0,
                      border: `2px solid ${active ? "var(--brand)" : "#c3ccc4"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {active ? (
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: "var(--brand)",
                        }}
                      />
                    ) : null}
                  </span>
                  {g.label}
                </span>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>
                  {clientPricePerM3(g)} {t("calc.perM3")}
                </span>
              </button>
            );
          })}
        </div>

        <label style={{ display: "block", fontSize: 12.5, color: "var(--muted)", marginTop: 14 }}>
          {t("calc.volume")}
          <input
            type="number"
            min={0}
            step={0.5}
            placeholder="0"
            value={volume || ""}
            onChange={(e) => setVolume(Math.max(0, Number(e.target.value) || 0))}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            style={fieldStyle}
          />
        </label>

        {error ? (
          <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 18 }}>{error}</p>
        ) : null}

        {plan ? (
          <div style={{ marginTop: 22, fontSize: 14 }}>
            <div
              style={{
                background: "var(--brand-soft)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "16px 18px",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>
                {t("cost.total")}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "var(--brand-darker)",
                  lineHeight: 1.1,
                  margin: "6px 0 12px",
                }}
              >
                ~{plan.cost.total} {plan.cost.currency}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 6,
                  paddingTop: 12,
                  borderTop: "1px solid var(--line)",
                  fontSize: 13.5,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>
                    {t("cost.concrete")}
                    {plan.cost.gradeLabel ? ` (${plan.cost.gradeLabel})` : ""}
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    {plan.cost.concreteTotal} {plan.cost.currency}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>{t("cost.transport")}</span>
                  <span style={{ fontWeight: 700 }}>
                    {plan.cost.delivery.total} {plan.cost.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Beton */}
            <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
              {plan.cost.gradeId ? (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "var(--muted)" }}>
                    {t("cost.concrete")} {plan.cost.gradeLabel} ({plan.cost.volume} m³ × {plan.cost.pricePerM3} lei)
                  </span>
                  <span style={{ fontWeight: 600 }}>{plan.cost.concreteTotal} lei</span>
                </div>
              ) : (
                <div style={{ color: "var(--muted)" }}>{t("calc.selectHint")}</div>
              )}
            </div>

            {/* Livrare */}
            <div style={{ color: "var(--brand-darker)", fontWeight: 600, margin: "0 0 8px" }}>
              {t("cost.delivery")} (
              {plan.cost.delivery.zone === "city" ? t("cost.zone.city") : t("cost.zone.outside")})
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {deliveryRows(plan.cost.delivery, t).map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "var(--muted)" }}>{b.label}</span>
                  <span style={{ fontWeight: 500 }}>{b.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ color: "var(--muted)" }}>{t("cost.totalDelivery")}</span>
                <span style={{ fontWeight: 600 }}>{plan.cost.delivery.total} lei</span>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "18px 0" }} />

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "var(--muted)", fontSize: 12.5 }}>
                {t("plan.chosenStation")}
              </div>
              <div style={{ color: "var(--brand-darker)", fontWeight: 700 }}>
                {plan.station.name}
              </div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {plan.legs.map((leg, i) => (
                <div key={i} style={{ color: "var(--muted)" }}>
                  {legName(leg.from, t)} → {legName(leg.to, t)}: {fmtKm(leg.distance)} · {fmtMin(leg.duration)}
                </div>
              ))}
              <div style={{ marginTop: 4 }}>
                <strong>
                  {t("plan.totalRoute")}: {fmtKm(plan.totalDistance)} · {fmtMin(plan.totalDuration)}
                </strong>
              </div>
            </div>

            <p style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5, margin: "18px 0 0" }}>
              {plan.cost.delivery.zone === "city" ? t("cost.note.city") : t("cost.note.outside")}
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function coord(p: LatLng) {
  return `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`;
}

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "9px 10px",
  borderRadius: 8,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  color: "var(--ink)",
  // 16px prevents iOS Safari from auto-zooming the page on focus.
  fontSize: 16,
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 10,
  border: "none",
  background: "var(--brand)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14.5,
};
