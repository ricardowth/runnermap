import type { Metadata } from "next";
import { requireUser } from "@/auth";
import { getRuns } from "@/lib/runs";
import { RunsView } from "./runs-view";

export const metadata: Metadata = { title: "Runs" };

export default async function RunsPage() {
  const user = await requireUser();
  const runs = await getRuns(user.id);
  return <RunsView runs={runs} />;
}
