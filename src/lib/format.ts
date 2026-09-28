export type Distance = "HALF" | "FULL";
export type Units = "km" | "mi";

export const DISTANCE_KM: Record<Distance, number> = {
  HALF: 21.0975,
  FULL: 42.195,
};

export const DISTANCE_LABEL: Record<Distance, string> = {
  HALF: "Half marathon",
  FULL: "Marathon",
};

export const DISTANCE_SHORT: Record<Distance, string> = {
  HALF: "Half",
  FULL: "Full",
};

const KM_PER_MI = 1.609344;

/** "3:45:12", "45:12" or "3h45m12s" -> seconds. Returns null when empty, NaN when invalid. */
export function parseDuration(input: string): number | null {
  const value = input.trim();
  if (!value) return null;
  const hms = value.match(/^(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?$/i);
  if (hms && (hms[1] || hms[2] || hms[3])) {
    return Number(hms[1] ?? 0) * 3600 + Number(hms[2] ?? 0) * 60 + Number(hms[3] ?? 0);
  }
  const parts = value.split(":").map((p) => p.trim());
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !/^\d+$/.test(p))) return NaN;
  const nums = parts.map(Number);
  const [h, m, s] = nums.length === 3 ? nums : [0, nums[0], nums[1]];
  if (m >= 60 || s >= 60) return NaN;
  return h * 3600 + m * 60 + s;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatPace(seconds: number | null | undefined, distance: Distance, units: Units): string {
  if (!seconds) return "—";
  const dist = units === "km" ? DISTANCE_KM[distance] : DISTANCE_KM[distance] / KM_PER_MI;
  const pace = Math.round(seconds / dist);
  return `${Math.floor(pace / 60)}:${String(pace % 60).padStart(2, "0")} /${units}`;
}

export function formatDistance(distance: Distance, units: Units): string {
  const km = DISTANCE_KM[distance];
  return units === "km" ? `${km.toFixed(1)} km` : `${(km / KM_PER_MI).toFixed(1)} mi`;
}

export function formatDate(date: Date | string, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(new Date(date));
}

/** yyyy-mm-dd for <input type="date"> */
export function toDateInput(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function flagEmoji(countryCode: string | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "🏁";
  return String.fromCodePoint(...[...countryCode.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}
