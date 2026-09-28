import { DISTANCE_KM } from "@/lib/format";
import type { RunDTO } from "@/lib/runs";

export function isUpcoming(run: Pick<RunDTO, "date">) {
  return new Date(run.date).getTime() > Date.now();
}

export function computeStats(runs: RunDTO[]) {
  const done = runs.filter((r) => !isUpcoming(r));
  const best = (d: RunDTO["distance"]) =>
    done
      .filter((r) => r.distance === d && r.finishTime)
      .reduce<RunDTO | null>((pb, r) => (!pb || r.finishTime! < pb.finishTime! ? r : pb), null);

  return {
    total: done.length,
    full: done.filter((r) => r.distance === "FULL").length,
    half: done.filter((r) => r.distance === "HALF").length,
    countries: new Set(done.map((r) => r.country.toLowerCase())).size,
    cities: new Set(done.map((r) => r.city.toLowerCase())).size,
    km: done.reduce((sum, r) => sum + DISTANCE_KM[r.distance], 0),
    pbFull: best("FULL"),
    pbHalf: best("HALF"),
    upcoming: runs.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/** Ids of runs that are a personal best for their distance */
export function pbIds(runs: RunDTO[]) {
  const s = computeStats(runs);
  return new Set([s.pbFull?.id, s.pbHalf?.id].filter(Boolean) as string[]);
}
