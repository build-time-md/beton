export type LatLng = {
  lat: number;
  lng: number;
};

export type ConcreteStation = {
  id: string;
  name: string;
  /** Operating company, if different from the station brand. */
  company?: string;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
  website?: string;
  /** false = coordinates approximate / not pinned to the exact site. */
  verified?: boolean;
};

/**
 * Minimal, customer-safe station shape sent to the browser — only what the map
 * needs to draw a pin. Real names/addresses/phones stay server-side.
 */
export type MapStation = {
  id: string;
  lat: number;
  lng: number;
};

/** A single segment of the delivery route, e.g. truck -> station. */
type RouteLeg = {
  from: string;
  to: string;
  /** meters */
  distance: number;
  /** seconds */
  duration: number;
};

/**
 * One selectable plant in the customer-facing picker. Like MapStation, it stays
 * anonymous — an opaque index plus the two facts a customer picks on: how far
 * the concrete travels and what a m³ costs there.
 */
export type StationOption = {
  /** Opaque index, same id space as MapStation / DeliveryPlan.station. */
  id: string;
  lat: number;
  lng: number;
  /** Road distance plant -> client (meters), from the routing matrix. */
  distance: number;
  /** Driving time plant -> client (seconds). */
  duration: number;
  /** Price/m³ (lei) at this plant for the selected grade; null when no grade. */
  pricePerM3: number | null;
  /** True for the plant the planner would pick on its own (the nearest one). */
  nearest: boolean;
  /** False when routing found no path from this plant — not selectable. */
  reachable: boolean;
};

export type DeliveryPlan = {
  station: MapStation;
  /** True when the customer forced this plant instead of taking the nearest. */
  stationForced: boolean;
  /** Every plant the customer may switch to, nearest first. */
  options: StationOption[];
  /** Chosen plant's grade id -> price/m³ (lei), for the widget's grade list. */
  gradePrices: Record<string, number>;
  legs: RouteLeg[];
  /** Full route polyline as [lat, lng] pairs, ready for Leaflet. */
  geometry: [number, number][];
  totalDistance: number;
  totalDuration: number;
  cost: import("./pricing").OrderEstimate;
};
