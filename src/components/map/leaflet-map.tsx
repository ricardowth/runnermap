"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useSettings } from "@/components/settings-provider";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  variant: "full" | "half" | "catalog";
  /** Star instead of a dot inside the pin (Majors / SuperHalfs) */
  star?: boolean;
  /** Gold dot/star (personal best) */
  gold?: boolean;
  popup?: React.ReactNode;
};

export type LeafletMapProps = {
  points: MapPoint[];
  className?: string;
  /** Focus (fly to) a point by id */
  focusId?: string | null;
  /** Enables click-to-pick mode (used by the run form) */
  onPick?: (lat: number, lng: number) => void;
  /** Zoom used when there is a single point */
  singleZoom?: number;
};

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const ESRI_ATTR =
  'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

type TileStyle = { url: string; labels?: string; attribution: string; maxZoom: number };

// All providers below work without an API key.
const TILES: Record<"light" | "dark" | "streets" | "satellite", TileStyle> = {
  light: {
    url: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    attribution: ESRI_ATTR,
    maxZoom: 16,
  },
  dark: {
    url: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    attribution: ESRI_ATTR,
    maxZoom: 16,
  },
  streets: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
};

// Slim teardrop pin, 20×30, with the inner glyph centred at (10, 10).
const PIN_PATH = "M10 0C4.5 0 0 4.4 0 9.9 0 17.4 10 30 10 30s10-12.6 10-20.1C20 4.4 15.5 0 10 0Z";
const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 2.1 : 5;
  const a = (Math.PI / 5) * i - Math.PI / 2;
  return `${(10 + r * Math.cos(a)).toFixed(2)},${(10 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

const PIN_COLORS: Record<MapPoint["variant"], { fill: string; stroke: string; glyph: string }> = {
  full: { fill: "var(--accent)", stroke: "#fff", glyph: "#fff" },
  half: { fill: "var(--half)", stroke: "#fff", glyph: "#fff" },
  catalog: { fill: "var(--surface)", stroke: "var(--muted)", glyph: "var(--muted)" },
};
const GOLD = "#facc15";

const iconCache = new Map<string, L.DivIcon>();
function pinIcon(variant: MapPoint["variant"], star = false, gold = false, count = 1) {
  const key = `${variant}|${star}|${gold}|${count}`;
  let icon = iconCache.get(key);
  if (!icon) {
    const c = PIN_COLORS[variant];
    const glyphColor = gold ? GOLD : c.glyph;
    const glyph = star
      ? `<polygon points="${STAR_POINTS}" fill="${glyphColor}"/>`
      : `<circle cx="10" cy="10" r="3.6" fill="${glyphColor}"/>`;
    icon = L.divIcon({
      className: "",
      html:
        `<div class="run-pin"><svg width="20" height="30" viewBox="-1 -1 22 32"><path d="${PIN_PATH}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>${glyph}</svg>` +
        (count > 1 ? `<span class="run-pin-count">${count}</span>` : "") +
        `</div>`,
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      popupAnchor: [0, -28],
    });
    iconCache.set(key, icon);
  }
  return icon;
}

/** Points closer than this (in degrees, ~300 m) share one pin. */
const GROUP_RADIUS = 0.003;

type PointGroup = { key: string; lat: number; lng: number; points: MapPoint[] };

/** Merge points at (almost) the same spot so every race stays clickable. */
function groupPoints(points: MapPoint[]): PointGroup[] {
  const groups: PointGroup[] = [];
  for (const p of points) {
    const g = groups.find((g) => Math.abs(g.lat - p.lat) < GROUP_RADIUS && Math.abs(g.lng - p.lng) < GROUP_RADIUS);
    if (g) g.points.push(p);
    else groups.push({ key: p.id, lat: p.lat, lng: p.lng, points: [p] });
  }
  return groups;
}

function GroupPopup({ group }: { group: PointGroup }) {
  const withPopup = group.points.filter((p) => p.popup);
  if (withPopup.length === 1) return <>{withPopup[0].popup}</>;
  return (
    <div className="min-w-56">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{withPopup.length} races here</p>
      <div className="-mr-2 max-h-72 divide-y divide-border overflow-y-auto pr-2">
        {withPopup.map((p) => (
          <div key={p.id} className="py-3 first:pt-0 last:pb-0">
            {p.popup}
          </div>
        ))}
      </div>
    </div>
  );
}

function FitBounds({ points, singleZoom }: { points: MapPoint[]; singleZoom: number }) {
  const map = useMap();
  // Refit only when the set of points changes, not on every render.
  const signature = points.map((p) => `${p.id}:${p.lat}:${p.lng}`).join("|");
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], Math.max(map.getZoom(), singleZoom));
      return;
    }
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [48, 48], maxZoom: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
  return null;
}

function Focus({ point, markers }: { point?: MapPoint; markers: React.RefObject<Map<string, L.Marker>> }) {
  const map = useMap();
  useEffect(() => {
    if (!point) return;
    map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 9), { duration: 0.8 });
    const marker = markers.current?.get(point.id);
    const t = setTimeout(() => marker?.openPopup(), 850);
    return () => clearTimeout(t);
  }, [point, map, markers]);
  return null;
}

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function LeafletMap({ points, className, focusId, onPick, singleZoom = 10 }: LeafletMapProps) {
  const { settings, isDark } = useSettings();
  const markers = useRef(new Map<string, L.Marker>());
  const style = settings.mapStyle === "auto" ? (isDark ? "dark" : "light") : settings.mapStyle;
  const tiles = TILES[style];
  const focusPoint = useMemo(() => points.find((p) => p.id === focusId), [points, focusId]);
  const groups = useMemo(() => groupPoints(points), [points]);

  return (
    <MapContainer
      center={[30, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={tiles.maxZoom}
      worldCopyJump
      scrollWheelZoom
      className={className ?? "h-full w-full"}
      style={onPick ? { cursor: "crosshair" } : undefined}
    >
      <TileLayer key={style} url={tiles.url} attribution={tiles.attribution} maxZoom={tiles.maxZoom} />
      {tiles.labels && <TileLayer key={`${style}-labels`} url={tiles.labels} maxZoom={tiles.maxZoom} />}
      {groups.map((g) => (
        <Marker
          key={g.key}
          position={[g.lat, g.lng]}
          icon={pinIcon(
            g.points[0].variant,
            g.points.some((p) => p.star),
            g.points.some((p) => p.gold),
            g.points.length,
          )}
          ref={(m) => {
            // Every point id in the group resolves to the shared marker (for focusing).
            for (const p of g.points) {
              if (m) markers.current.set(p.id, m);
              else markers.current.delete(p.id);
            }
          }}
        >
          {g.points.some((p) => p.popup) && (
            <Popup>
              <GroupPopup group={g} />
            </Popup>
          )}
        </Marker>
      ))}
      <FitBounds points={points} singleZoom={singleZoom} />
      <Focus point={focusPoint} markers={markers} />
      {onPick && <ClickToPick onPick={onPick} />}
    </MapContainer>
  );
}
