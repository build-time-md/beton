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

/** A single segment of the delivery route, e.g. truck -> station. */
export type RouteLeg = {
  from: string;
  to: string;
  /** meters */
  distance: number;
  /** seconds */
  duration: number;
};

export type DeliveryPlan = {
  station: ConcreteStation;
  legs: RouteLeg[];
  /** Full route polyline as [lat, lng] pairs, ready for Leaflet. */
  geometry: [number, number][];
  totalDistance: number;
  totalDuration: number;
  cost: import("./pricing").OrderEstimate;
};
