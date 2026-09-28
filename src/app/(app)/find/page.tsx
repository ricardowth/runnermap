import type { Metadata } from "next";
import { requireUser } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FindView } from "./find-view";

export const metadata: Metadata = { title: "Find a run" };

export default async function FindPage() {
  const user = await requireUser();
  const runs = await prisma.run.findMany({
    where: { userId: user.id, raceSlug: { not: null } },
    select: { raceSlug: true },
  });
  return <FindView doneSlugs={[...new Set(runs.map((r) => r.raceSlug!))]} />;
}
