"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trophy } from "lucide-react";
import clsx from "clsx";
import { PbBadge, SeriesBadge } from "@/components/badges";
import { DeleteRunButton } from "@/components/delete-run-button";
import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/components/settings-provider";
import { countryCodeFor, seriesForRun } from "@/data/races";
import { DISTANCE_SHORT, flagEmoji, formatDate, formatDuration, formatPace, type Distance } from "@/lib/format";
import type { RunDTO } from "@/lib/runs";
import { isUpcoming, pbIds } from "@/lib/stats";

type Filter = "ALL" | Distance;

export function RunsView({ runs }: { runs: RunDTO[] }) {
  const { settings } = useSettings();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const pbs = useMemo(() => pbIds(runs), [runs]);

  const byYear = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = runs.filter(
      (r) =>
        (filter === "ALL" || r.distance === filter) &&
        (!q || [r.name, r.city, r.country, r.bibNumber ?? ""].some((v) => v.toLowerCase().includes(q))),
    );
    const groups = new Map<string, RunDTO[]>();
    for (const run of filtered) {
      const year = run.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), run]);
    }
    return [...groups.entries()];
  }, [runs, filter, query]);

  return (
    <>
      <PageHeader
        title="Runs"
        description="Every half and full marathon you've added."
        actions={
          <Link href="/runs/new" className="btn-primary">
            <Plus className="size-4" /> Add run
          </Link>
        }
      />

      {runs.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="size-7" />
          </span>
          <p className="font-display mt-4 text-xl font-bold">No runs yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Add the races you&apos;ve finished with date, bib number and time.
          </p>
          <div className="mt-6 flex gap-2">
            <Link href="/runs/new" className="btn-primary">
              <Plus className="size-4" /> Add your first run
            </Link>
            <Link href="/find" className="btn-secondary">
              Browse catalog
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                className="input pl-9"
                placeholder="Search by race, city, country or bib"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented value={filter} onChange={setFilter} />
          </div>

          {byYear.length === 0 && <p className="card p-6 text-center text-sm text-muted">No runs match your search.</p>}

          <div className="space-y-6">
            {byYear.map(([year, list]) => (
              <section key={year}>
                <h2 className="font-display mb-2 flex items-baseline gap-2 px-1 text-lg font-bold">
                  {year}
                  <span className="text-xs font-medium text-muted">
                    {list.length} race{list.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <ul className="card divide-y divide-border overflow-hidden">
                  {list.map((run) => (
                    <li key={run.id} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4">
                      <span
                        className={clsx(
                          "grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold",
                          run.distance === "FULL" ? "bg-accent-soft text-accent" : "bg-half-soft text-half",
                        )}
                      >
                        {run.distance === "FULL" ? "42" : "21"}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate font-semibold">
                          <span className="truncate">{run.name}</span>
                          {pbs.has(run.id) && <PbBadge />}
                          <SeriesBadge series={seriesForRun(run)} />
                          {isUpcoming(run) && <span className="chip shrink-0 bg-surface-2 text-muted">Upcoming</span>}
                        </p>
                        <p className="truncate text-xs text-muted sm:text-sm">
                          {formatDate(run.date)} · {flagEmoji(countryCodeFor(run.country))} {run.city}, {run.country}
                        </p>
                      </div>

                      <dl className="hidden gap-6 text-right text-sm md:flex">
                        <div className="w-16">
                          <dt className="text-xs text-muted">Bib</dt>
                          <dd className="font-semibold">{run.bibNumber ?? "—"}</dd>
                        </div>
                        {settings.showPace && (
                          <div className="w-24">
                            <dt className="text-xs text-muted">Pace</dt>
                            <dd className="font-semibold tabular-nums">
                              {formatPace(run.finishTime, run.distance, settings.units)}
                            </dd>
                          </div>
                        )}
                      </dl>
                      <div className="w-20 text-right">
                        <p className="text-xs text-muted md:hidden">{DISTANCE_SHORT[run.distance]}</p>
                        <p className="hidden text-xs text-muted md:block">Time</p>
                        <p className="font-semibold tabular-nums">{formatDuration(run.finishTime)}</p>
                      </div>

                      <div className="flex shrink-0 items-center">
                        <Link
                          href={`/runs/${run.id}/edit`}
                          aria-label={`Edit ${run.name}`}
                          className="btn px-2.5 py-2 text-muted hover:bg-surface-2 hover:text-text"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteRunButton id={run.id} name={run.name} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Segmented({ value, onChange }: { value: Filter; onChange: (v: Filter) => void }) {
  const options: { value: Filter; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "FULL", label: "Marathon" },
    { value: "HALF", label: "Half" },
  ];
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "rounded-lg px-3.5 py-1.5 text-sm font-medium transition",
            value === o.value ? "bg-accent text-white" : "text-muted hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
