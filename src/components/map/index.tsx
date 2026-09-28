"use client";

import dynamic from "next/dynamic";
import type { LeafletMapProps } from "./leaflet-map";

export type { MapPoint } from "./leaflet-map";

// Leaflet touches `window`, so it can only render on the client.
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-2" />,
});

export function RunMap(props: LeafletMapProps) {
  return <LeafletMap {...props} />;
}
