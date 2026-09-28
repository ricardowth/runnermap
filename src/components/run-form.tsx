"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { AlertCircle, Loader2, MapPin, Search, Sparkles, X } from "lucide-react";
import clsx from "clsx";
import { RunMap, type MapPoint } from "@/components/map";
import { useSettings } from "@/components/settings-provider";
import { RACES, type CatalogRace } from "@/data/races";
import { raceToValues, type RunFormValues } from "@/lib/run-form-values";
import { DISTANCE_LABEL, flagEmoji, formatPace, parseDuration } from "@/lib/format";
import type { RunFormState } from "@/app/(app)/runs/actions";
import type { GeocodeResult } from "@/app/api/geocode/route";

type Props = {
  action: (state: RunFormState, formData: FormData) => Promise<RunFormState>;
  initial: RunFormValues;
  submitLabel: string;
  /** Show the "start from catalog" picker (new runs only) */
  showCatalogPicker?: boolean;
};

export function RunForm({ action, initial, submitLabel, showCatalogPicker }: Props) {
  const { settings } = useSettings();
  const [state, formAction, pending] = useActionState(action, {});
  // All fields are controlled so values survive a failed submit.
  const [v, setV] = useState<RunFormValues>(initial);
  const set = (patch: Partial<RunFormValues>) => setV((prev) => ({ ...prev, ...patch }));
  const errors = state.errors ?? {};

  const seconds = parseDuration(v.finishTime);
  const pace = seconds && !Number.isNaN(seconds) ? formatPace(seconds, v.distance, settings.units) : null;

  const points: MapPoint[] = useMemo(
    () =>
      v.lat != null && v.lng != null
        ? [
            {
              id: "picked",
              lat: v.lat,
              lng: v.lng,
              variant: v.distance === "FULL" ? "full" : "half",
            },
          ]
        : [],
    [v.lat, v.lng, v.distance],
  );

  async function pickOnMap(lat: number, lng: number) {
    set({ lat, lng });
    // Fill city/country from the map click when they're still empty
    if (v.city && v.country) return;
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      const [place] = (await res.json()) as GeocodeResult[];
      if (place) {
        setV((prev) => ({ ...prev, city: prev.city || place.city, country: prev.country || place.country }));
      }
    } catch {
      // reverse geocoding is a nice-to-have
    }
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* hidden values */}
      <input type="hidden" name="distance" value={v.distance} />
      <input type="hidden" name="lat" value={v.lat ?? ""} />
      <input type="hidden" name="lng" value={v.lng ?? ""} />
      <input type="hidden" name="raceSlug" value={v.raceSlug} />

      <div className="space-y-6">
        {showCatalogPicker && (
          <CatalogPicker selected={v.raceSlug} onSelect={(race) => set(race ? raceToValues(race) : { raceSlug: "" })} />
        )}

        <fieldset className="card space-y-4 p-5">
          <legend className="sr-only">Race details</legend>
          <h2 className="font-semibold">Race details</h2>

          <Field label="Race name" error={errors.name}>
            <input
              name="name"
              className="input"
              placeholder="e.g. Berlin Marathon"
              value={v.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>

          <Field label="Distance" error={errors.distance}>
            <div className="grid grid-cols-2 gap-2">
              {(["FULL", "HALF"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set({ distance: d })}
                  className={clsx(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                    v.distance === d
                      ? d === "FULL"
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-half bg-half-soft text-half"
                      : "border-border text-muted hover:bg-surface-2",
                  )}
                >
                  {DISTANCE_LABEL[d]}
                  <span className="ml-1.5 font-normal opacity-70">{d === "FULL" ? "42.2 km" : "21.1 km"}</span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                name="date"
                className="input"
                value={v.date}
                onChange={(e) => set({ date: e.target.value })}
              />
            </Field>
            <Field label="Bib number" error={errors.bibNumber} optional>
              <input
                name="bibNumber"
                className="input"
                placeholder="e.g. 12345"
                value={v.bibNumber}
                onChange={(e) => set({ bibNumber: e.target.value })}
              />
            </Field>
          </div>

          <Field
            label="Finish time"
            error={errors.finishTime}
            optional
            hint={pace ? `Pace ${pace}` : "Format h:mm:ss — leave empty for upcoming races"}
          >
            <input
              name="finishTime"
              className="input tabular-nums"
              placeholder="3:45:12"
              inputMode="numeric"
              value={v.finishTime}
              onChange={(e) => set({ finishTime: e.target.value })}
            />
          </Field>

          <Field label="Notes" error={errors.notes} optional>
            <textarea
              name="notes"
              rows={3}
              className="input resize-none"
              placeholder="Weather, how it felt, who you ran with…"
              value={v.notes}
              onChange={(e) => set({ notes: e.target.value })}
            />
          </Field>
        </fieldset>
      </div>

      <div className="space-y-6">
        <fieldset className="card space-y-4 p-5">
          <legend className="sr-only">Location</legend>
          <div>
            <h2 className="font-semibold">Location</h2>
            <p className="text-sm text-muted">Search for a place or click on the map to drop the pin.</p>
          </div>

          <PlaceSearch onSelect={(p) => set({ city: p.city, country: p.country, lat: p.lat, lng: p.lng })} />

          <div className="h-72 overflow-hidden rounded-xl border border-border sm:h-80">
            <RunMap points={points} onPick={pickOnMap} singleZoom={9} />
          </div>
          {errors.location && <ErrorText>{errors.location}</ErrorText>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city}>
              <input name="city" className="input" value={v.city} onChange={(e) => set({ city: e.target.value })} />
            </Field>
            <Field label="Country" error={errors.country}>
              <input
                name="country"
                className="input"
                value={v.country}
                onChange={(e) => set({ country: e.target.value })}
              />
            </Field>
          </div>
        </fieldset>

        {state.message && (
          <p className="flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            <AlertCircle className="size-4" /> {state.message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Link href="/runs" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn-primary min-w-32" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </span>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs font-medium text-danger">{children}</p>;
}

function CatalogPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (race: CatalogRace | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const current = RACES.find((r) => r.slug === selected);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return RACES.filter((r) => `${r.name} ${r.city} ${r.country}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  return (
    <div className="card border-dashed p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <Sparkles className="size-4 text-accent" /> Start from the catalog
      </h2>
      <p className="mb-3 text-sm text-muted">Pick a known race to fill in the name, distance and location.</p>

      {current ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-2.5">
          <span className="min-w-0 truncate text-sm">
            {flagEmoji(current.countryCode)} <span className="font-semibold">{current.name}</span>{" "}
            <span className="text-muted">· {current.city}</span>
          </span>
          <button type="button" onClick={() => onSelect(null)} className="text-muted hover:text-text" aria-label="Clear">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Search races, e.g. Lisbon"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onFocus={() => setOpen(true)}
          />
          {open && matches.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-[1100] mt-1 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              {matches.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm hover:bg-surface-2"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onSelect(r);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <span className="truncate">
                      {flagEmoji(r.countryCode)} {r.name} <span className="text-muted">· {r.city}</span>
                    </span>
                    <span className={r.distance === "FULL" ? "chip-full" : "chip-half"}>
                      {r.distance === "FULL" ? "Full" : "Half"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function PlaceSearch({ onSelect }: { onSelect: (place: GeocodeResult) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      setResults(res.ok ? await res.json() : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Search a city or place"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          />
        </div>
        <button type="button" onClick={search} className="btn-secondary" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
      {results && (
        <ul className="absolute inset-x-0 top-full z-[1100] mt-1 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          {results.length === 0 && <li className="px-3.5 py-2.5 text-sm text-muted">No places found.</li>}
          {results.map((p) => (
            <li key={`${p.lat},${p.lng}`}>
              <button
                type="button"
                className="w-full px-3.5 py-2.5 text-left text-sm hover:bg-surface-2"
                onClick={() => {
                  onSelect(p);
                  setResults(null);
                  setQuery("");
                }}
              >
                <span className="line-clamp-1">{p.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
