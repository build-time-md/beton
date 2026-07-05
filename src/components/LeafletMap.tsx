"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapStation, LatLng } from "@/lib/types";
import { BRAND } from "@/lib/brand";

const TILE_URL =
  process.env.NEXT_PUBLIC_TILE_URL ??
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  process.env.NEXT_PUBLIC_TILE_ATTRIBUTION ??
  "&copy; OpenStreetMap contributors &copy; CARTO";

// Lucide-style line glyphs (24x24 space), drawn white inside the pin face.
const GLYPHS = {
  // factory — concrete batching plant
  station:
    '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M7 18h.01M12 18h.01M17 18h.01"/>',
  // home — the delivery destination (client / site)
  client:
    '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
} as const;

/**
 * Branded map pin: colored teardrop with a white face and a colored line glyph.
 * Built as inline SVG so we don't depend on Leaflet's bundled image assets.
 * Shadow is applied via the `.pin-marker` CSS class (see globals.css).
 */
function pin(
  color: string,
  glyph: string,
  opts: { ring?: boolean } = {},
): L.DivIcon {
  const ring = opts.ring
    ? `<circle cx="20" cy="18" r="18" fill="${color}" fill-opacity="0.18"/>`
    : "";
  return L.divIcon({
    className: "pin-marker",
    html: `<svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
      ${ring}
      <path d="M20 2C11 2 4 9 4 18c0 11 16 30 16 30s16-19 16-30C36 9 29 2 20 2Z" fill="${color}"/>
      <circle cx="20" cy="18" r="12" fill="#fff"/>
      <g transform="translate(12.5,10.5) scale(0.625)" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
    </svg>`,
    iconSize: [40, 52],
    iconAnchor: [20, 50],
    popupAnchor: [0, -46],
  });
}

const icons = {
  client: pin(BRAND.client, GLYPHS.client),
  station: pin(BRAND.grey, GLYPHS.station),
  chosen: pin(BRAND.green, GLYPHS.station, { ring: true }),
};

/** Fit the map to the full route whenever a new one is computed. */
function FitRoute({ geometry }: { geometry?: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!geometry || geometry.length < 2) return;
    const bounds = L.latLngBounds(geometry);
    // Below 768px the panel sits under the map (no overlap); above, it floats
    // over the left side, so reserve its real width (348px or 680px) + margin
    // as left padding to keep the whole route clear of it.
    const isMobile =
      typeof window !== "undefined" && window.innerWidth <= 768;
    let padLeft = 40;
    if (!isMobile && typeof document !== "undefined") {
      const panel = document.querySelector<HTMLElement>(".app__panel");
      padLeft = panel ? Math.round(panel.getBoundingClientRect().width) + 40 : 400;
    }
    map.fitBounds(bounds, {
      paddingTopLeft: [padLeft, isMobile ? 40 : 50],
      paddingBottomRight: [40, 40],
    });
  }, [geometry, map]);
  return null;
}

function ClickHandler({ onClick }: { onClick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export type LeafletMapProps = {
  center: [number, number];
  zoom: number;
  stations: MapStation[];
  client: LatLng | null;
  chosenStationId?: string;
  /** Generic label shown for every plant (real names are hidden from customers). */
  stationLabel: string;
  geometry?: [number, number][];
  onMapClick: (p: LatLng) => void;
};

export default function LeafletMap({
  center,
  zoom,
  stations,
  client,
  chosenStationId,
  stationLabel,
  geometry,
  onMapClick,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <ZoomControl position="topright" />
      <FitRoute geometry={geometry} />
      <TileLayer
        url={TILE_URL}
        attribution={ATTRIBUTION}
        subdomains="abcd"
        maxZoom={20}
      />
      <ClickHandler onClick={onMapClick} />

      {stations.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={s.id === chosenStationId ? icons.chosen : icons.station}
        >
          {/* Permanent generic label above the pin — real plant names stay hidden. */}
          <Tooltip permanent direction="top" offset={[0, -46]} className="station-tip">
            {stationLabel}
          </Tooltip>
          <Popup>
            <strong>{stationLabel}</strong>
          </Popup>
        </Marker>
      ))}

      {client ? (
        <Marker position={[client.lat, client.lng]} icon={icons.client}>
          <Popup>Client (destinație)</Popup>
        </Marker>
      ) : null}

      {geometry && geometry.length > 1 ? (
        <Polyline positions={geometry} pathOptions={{ color: BRAND.route, weight: 5 }} />
      ) : null}
    </MapContainer>
  );
}
