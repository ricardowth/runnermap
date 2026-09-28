import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/auth";
import { PageHeader } from "@/components/page-header";
import { RunForm } from "@/components/run-form";
import { formatDuration, toDateInput } from "@/lib/format";
import { getRun } from "@/lib/runs";
import { updateRun } from "../../actions";

export const metadata: Metadata = { title: "Edit run" };

export default async function EditRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const run = await getRun(user.id, id);
  if (!run) notFound();

  return (
    <>
      <PageHeader title="Edit run" description={run.name} />
      <RunForm
        action={updateRun.bind(null, run.id)}
        submitLabel="Save changes"
        initial={{
          name: run.name,
          distance: run.distance,
          date: toDateInput(run.date),
          bibNumber: run.bibNumber ?? "",
          finishTime: run.finishTime ? formatDuration(run.finishTime) : "",
          city: run.city,
          country: run.country,
          lat: run.lat,
          lng: run.lng,
          notes: run.notes ?? "",
          raceSlug: run.raceSlug ?? "",
        }}
      />
    </>
  );
}
