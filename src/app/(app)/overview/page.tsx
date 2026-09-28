import type { Metadata } from "next";
import { requireUser } from "@/auth";
import { getRuns } from "@/lib/runs";
import { OverviewView } from "./overview-view";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const user = await requireUser();
  const runs = await getRuns(user.id);
  return <OverviewView runs={runs} firstName={user.name?.split(" ")[0] ?? "runner"} />;
}
