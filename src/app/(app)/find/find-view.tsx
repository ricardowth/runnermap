"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Award, CalendarDays, Check, ExternalLink, MapPin, Plus, Search, Star } from "lucide-react";
import clsx from "clsx";
import { SeriesBadge } from "@/components/badges";
import { PageHeader } from "@/components/page-header";
import { RunMap, type MapPoint } from "@/components/map";
import { COUNTRIES, RACES, SERIES, type CatalogRace, type Series } from "@/data/races";
import { DISTANCE_LABEL, MONTHS, flagEmoji, type Distance } from "@/lib/format";

type DistanceFilter = "ALL" | Distance;

export function FindView({ doneSlugs }: { doneSlugs: string[] }) {
  const done = useMemo(() => new Set(doneSlugs), [doneSlugs]);
  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState<DistanceFilter>("ALL");
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState(0);
  const [series, setSeries] = useState<Series | "">("");
  const [focusId, setFocusId] = useState<string | null>(null);

  const races = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RACES.filter(
      (r) =>
        (distance === "ALL" || r.distance === distance) &&
        (!country || r.country === country) &&
        (!month || r.month === month) &&
        (!series || r.series === series) &&
        (!q || `${r.name} ${r.city} ${r.country}`.toLowerCase().includes(q)),
    ).sort((a, b) => a.month - b.month || a.name.localeCompare(b.name));
  }, [query, distance, country, month, series]);

  const points: MapPoint[] = useMemo(
    () =>
      races.map((r) => ({
        id: r.slug,
        lat: r.lat,
        lng: r.lng,
        variant: done.has(r.slug) ? (r.distance === "FULL" ? "full" : "half") : "catalog",
        star: !!r.series,
        popup: <RacePopup race={r} done={done.has(r.slug)} />,
      })),
    [races, done],
  );

  const hasFilters = query || distance !== "ALL" || country || month || series;

  return (
    <>
      <PageHeader
        title="Find a run"
        description={`${RACES.length} half and full marathons around the world. Plan your next one — or log one you've done.`}
      />

      <div className="card mb-4 grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_170px_150px_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Search race or city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="inline-flex rounded-xl border border-border p-1">
          {(["ALL", "FULL", "HALF"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDistance(d)}
              className={clsx(
                "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                distance === d ? "bg-accent text-white" : "text-muted hover:text-text",
              )}
            >
              {d === "ALL" ? "All" : d === "FULL" ? "Marathon" : "Half"}
            </button>
          ))}
        </div>
        <select className="input" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.name} value={c.name}>
              {flagEmoji(c.code)} {c.name}
            </option>
          ))}
        </select>
        <select className="input" value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Month">
          <option value={0}>Any month</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          {(
            [
              ["major", Star, "Majors"],
              ["superhalf", Award, "SuperHalfs"],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              key={value}
              onClick={() => setSeries((s) => (s === value ? "" : value))}
              title={SERIES[value].name}
              className={clsx(
                "btn flex-1 border px-3",
                series === value
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:bg-surface-2",
              )}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card relative mb-6 h-[340px] overflow-hidden sm:h-[420px]">
        <RunMap points={points} focusId={focusId} />
      </div>

      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm text-muted">
          {races.length} race{races.length === 1 ? "" : "s"}
        </p>
        {hasFilters && (
          <button
            className="text-sm font-semibold text-accent hover:underline"
            onClick={() => {
              setQuery("");
              setDistance("ALL");
              setCountry("");
              setMonth(0);
              setSeries("");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {races.map((race) => (
          <li key={race.slug}>
            <RaceCard
              race={race}
              done={done.has(race.slug)}
              active={focusId === race.slug}
              onFocus={() => {
                setFocusId(race.slug);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function RaceCard({
  race,
  done,
  active,
  onFocus,
}: {
  race: CatalogRace;
  done: boolean;
  active: boolean;
  onFocus: () => void;
}) {
  return (
    <article className={clsx("card flex h-full flex-col p-4 transition", active && "ring-2 ring-accent")}>
      <div className="flex items-start justify-between gap-2">
        <span className={race.distance === "FULL" ? "chip-full" : "chip-half"}>{DISTANCE_LABEL[race.distance]}</span>
        <div className="flex gap-1">
          <SeriesBadge series={race.series} />
          {done && (
            <span className="chip bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Check className="size-3" /> Done
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-3 font-semibold leading-snug">{race.name}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <span>{flagEmoji(race.countryCode)}</span> {race.city}, {race.country}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <CalendarDays className="size-3.5" /> Usually in {MONTHS[race.month - 1]}
      </p>

      <div className="mt-4 flex flex-1 items-end gap-2">
        <Link href={`/runs/new?race=${race.slug}`} className="btn-primary flex-1 py-2">
          <Plus className="size-4" /> {done ? "Add again" : "I ran this"}
        </Link>
        <button onClick={onFocus} className="btn-secondary px-3 py-2" aria-label={`Show ${race.name} on map`}>
          <MapPin className="size-4" />
        </button>
        {race.website && (
          <a
            href={race.website}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-3 py-2"
            aria-label={`${race.name} website`}
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function RacePopup({ race, done }: { race: CatalogRace; done: boolean }) {
  return (
    <div className="min-w-48">
      <span className={race.distance === "FULL" ? "chip-full" : "chip-half"}>{DISTANCE_LABEL[race.distance]}</span>
      <p className="mt-2 text-sm font-bold leading-tight">{race.name}</p>
      <p className="text-xs text-muted">
        {flagEmoji(race.countryCode)} {race.city} · {MONTHS[race.month - 1]}
      </p>
      <Link href={`/runs/new?race=${race.slug}`} className="mt-3 inline-block text-xs font-semibold !text-accent">
        {done ? "Add again →" : "I ran this →"}
      </Link>
    </div>
  );
}
