import "server-only";
import { prisma } from "@/lib/prisma";
import type { Distance } from "@/lib/format";

export type RunDTO = {
  id: string;
  name: string;
  distance: Distance;
  date: string;
  bibNumber: string | null;
  finishTime: number | null;
  city: string;
  country: string;
  lat: number;
  lng: number;
  notes: string | null;
  raceSlug: string | null;
};

type RunRow = Awaited<ReturnType<typeof prisma.run.findFirstOrThrow>>;

export function toDTO(run: RunRow): RunDTO {
  return {
    id: run.id,
    name: run.name,
    distance: run.distance as Distance,
    date: run.date.toISOString(),
    bibNumber: run.bibNumber,
    finishTime: run.finishTime,
    city: run.city,
    country: run.country,
    lat: run.lat,
    lng: run.lng,
    notes: run.notes,
    raceSlug: run.raceSlug,
  };
}

export async function getRuns(userId: string): Promise<RunDTO[]> {
  const runs = await prisma.run.findMany({ where: { userId }, orderBy: { date: "desc" } });
  return runs.map(toDTO);
}

export async function getRun(userId: string, id: string): Promise<RunDTO | null> {
  const run = await prisma.run.findFirst({ where: { id, userId } });
  return run ? toDTO(run) : null;
}
