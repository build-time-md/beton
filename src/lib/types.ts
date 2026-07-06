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

export type DeliveryPlan = {
  station: MapStation;
  /** Chosen plant's grade id -> price/m³ (lei), for the widget's grade list. */
  gradePrices: Record<string, number>;
  legs: RouteLeg[];
  /** Full route polyline as [lat, lng] pairs, ready for Leaflet. */
  geometry: [number, number][];
  totalDistance: number;
  totalDuration: number;
  cost: import("./pricing").OrderEstimate;
};
