"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarClock, Compass, Flag, Globe2, Plus, Route, Timer } from "lucide-react";
import clsx from "clsx";
import { PbBadge, SeriesBadge } from "@/components/badges";
import { PageHeader } from "@/components/page-header";
import { RunMap, type MapPoint } from "@/components/map";
import { RunPopup } from "@/components/run-popup";
import { useSettings } from "@/components/settings-provider";
import { seriesForRun } from "@/data/races";
import { formatDate, formatDuration } from "@/lib/format";
import type { RunDTO } from "@/lib/runs";
import { computeStats, isUpcoming, pbIds } from "@/lib/stats";

export function OverviewView({ runs, firstName }: { runs: RunDTO[]; firstName: string }) {
  const { settings } = useSettings();
  const [focusId, setFocusId] = useState<string | null>(null);
  const stats = useMemo(() => computeStats(runs), [runs]);
  const pbs = useMemo(() => pbIds(runs), [runs]);

  const points: MapPoint[] = useMemo(
    () =>
      runs.map((run) => ({
        id: run.id,
        lat: run.lat,
        lng: run.lng,
        variant: run.distance === "FULL" ? "full" : "half",
        star: !!seriesForRun(run),
        gold: pbs.has(run.id),
        popup: <RunPopup run={run} pb={pbs.has(run.id)} />,
      })),
    [runs, pbs],
  );

  const distance = settings.units === "km" ? stats.km : stats.km / 1.609344;

  return (
    <>
      <PageHeader
        title={`Hi, ${firstName}`}
        description={
          stats.total
            ? `You've finished ${stats.total} race${stats.total === 1 ? "" : "s"} in ${stats.countries} countr${stats.countries === 1 ? "y" : "ies"}.`
            : "Your running world starts here."
        }
        actions={
          <Link href="/runs/new" className="btn-primary">
            <Plus className="size-4" /> Add run
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat icon={Flag} label="Races finished" value={stats.total} hint={`${stats.full} full · ${stats.half} half`} />
        <Stat
          icon={Route}
          label="Race distance"
          value={`${Math.round(distance).toLocaleString("en")} ${settings.units}`}
          hint="Across all finishes"
        />
        <Stat icon={Globe2} label="Countries" value={stats.countries} hint={`${stats.cities} cities`} />
        <Stat
          icon={Timer}
          label="Personal bests"
          value={
            <span className="flex flex-col text-base leading-tight sm:text-lg">
              <span>
                <span className="text-accent">M</span> {formatDuration(stats.pbFull?.finishTime)}
              </span>
              <span>
                <span className="text-half">H</span> {formatDuration(stats.pbHalf?.finishTime)}
              </span>
            </span>
          }
        />
      </section>

      {stats.upcoming.length > 0 && (
        <div className="card mt-4 flex items-center gap-3 p-4">
          <CalendarClock className="size-5 shrink-0 text-accent" />
          <p className="text-sm">
            <span className="font-semibold">Next up:</span> {stats.upcoming[0].name} ·{" "}
            <span className="text-muted">{formatDate(stats.upcoming[0].date, { dateStyle: "long" })}</span>
          </p>
        </div>
      )}

      <section className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[1fr_320px]">
        <div className="card relative h-[420px] overflow-hidden sm:h-[520px] lg:h-[600px]">
          <RunMap points={points} focusId={focusId} />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex gap-2">
            <span className="chip-full bg-surface! shadow-card">
              <span className="size-2 rounded-full bg-accent" /> Marathon
            </span>
            <span className="chip-half bg-surface! shadow-card">
              <span className="size-2 rounded-full bg-half" /> Half
            </span>
          </div>
          {runs.length === 0 && <EmptyOverlay />}
        </div>

        <aside className="card flex max-h-[600px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-semibold">Your races</h2>
            <Link href="/runs" className="text-xs font-semibold text-accent hover:underline">
              Manage
            </Link>
          </div>
          {runs.length === 0 ? (
            <p className="p-4 text-sm text-muted">No races yet. Add one and it will appear here and on the map.</p>
          ) : (
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {runs.map((run) => (
                <li key={run.id}>
                  <button
                    onClick={() => setFocusId(run.id === focusId ? null : run.id)}
                    className={clsx(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-2",
                      focusId === run.id && "bg-surface-2",
                    )}
                  >
                    <span
                      className={clsx(
                        "grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold",
                        run.distance === "FULL" ? "bg-accent-soft text-accent" : "bg-half-soft text-half",
                      )}
                    >
                      {run.distance === "FULL" ? "42" : "21"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{run.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {formatDate(run.date)} · {run.city}
                      </span>
                      {(pbs.has(run.id) || seriesForRun(run)) && (
                        <span className="mt-1 flex gap-1">
                          {pbs.has(run.id) && <PbBadge />}
                          <SeriesBadge series={seriesForRun(run)} />
                        </span>
                      )}
                    </span>
                    <span className="text-right text-xs">
                      {isUpcoming(run) ? (
                        <span className="chip bg-surface-2 text-muted">Upcoming</span>
                      ) : (
                        <span className="font-semibold tabular-nums">{formatDuration(run.finishTime)}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="card p-4 lg:p-5">
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        <Icon className="size-4" /> {label}
      </div>
      <div className="font-display mt-2 text-2xl font-bold tabular-nums sm:text-3xl">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function EmptyOverlay() {
  return (
    <div className="absolute inset-0 z-[500] grid place-items-center bg-bg/40 p-4 backdrop-blur-[2px]">
      <div className="card max-w-sm p-6 text-center">
        <p className="font-display text-xl font-bold">Pin your first race</p>
        <p className="mt-2 text-sm text-muted">
          Add a half or full marathon you&apos;ve run, or pick one from the catalog.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/runs/new" className="btn-primary">
            <Plus className="size-4" /> Add run
          </Link>
          <Link href="/find" className="btn-secondary">
            <Compass className="size-4" /> Find a run
          </Link>
        </div>
      </div>
    </div>
  );
}
