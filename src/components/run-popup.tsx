"use client";

import Link from "next/link";
import { PbBadge, SeriesBadge } from "@/components/badges";
import { seriesForRun } from "@/data/races";
import { DISTANCE_LABEL, formatDate, formatDuration, formatPace } from "@/lib/format";
import type { RunDTO } from "@/lib/runs";
import { useSettings } from "@/components/settings-provider";

export function RunPopup({ run, pb }: { run: RunDTO; pb?: boolean }) {
  const { settings } = useSettings();
  return (
    <div className="min-w-52">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={run.distance === "FULL" ? "chip-full" : "chip-half"}>{DISTANCE_LABEL[run.distance]}</span>
        {pb && <PbBadge />}
        <SeriesBadge series={seriesForRun(run)} />
      </div>
      <p className="mt-2 text-sm font-bold leading-tight">{run.name}</p>
      <p className="text-xs text-muted">
        {run.city}, {run.country} · {formatDate(run.date)}
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-muted">Time</dt>
          <dd className="font-semibold tabular-nums">{formatDuration(run.finishTime)}</dd>
        </div>
        {settings.showPace && (
          <div>
            <dt className="text-muted">Pace</dt>
            <dd className="font-semibold tabular-nums">{formatPace(run.finishTime, run.distance, settings.units)}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted">Bib</dt>
          <dd className="font-semibold">{run.bibNumber ?? "—"}</dd>
        </div>
      </dl>
      <Link href={`/runs/${run.id}/edit`} className="mt-3 inline-block text-xs font-semibold !text-accent">
        Edit run →
      </Link>
    </div>
  );
}
