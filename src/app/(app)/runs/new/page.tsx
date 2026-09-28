import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { RunForm } from "@/components/run-form";
import { EMPTY_RUN, raceToValues } from "@/lib/run-form-values";
import { getRace } from "@/data/races";
import { createRun } from "../actions";

export const metadata: Metadata = { title: "Add run" };

export default async function NewRunPage({ searchParams }: { searchParams: Promise<{ race?: string }> }) {
  const { race: slug } = await searchParams;
  const race = getRace(slug);

  return (
    <>
      <PageHeader
        title="Add a run"
        description={race ? `Adding ${race.name} — just fill in your date, bib and time.` : "Log a half or full marathon you've run."}
      />
      <RunForm
        action={createRun}
        initial={{ ...EMPTY_RUN, ...(race ? raceToValues(race) : {}) }}
        submitLabel="Save run"
        showCatalogPicker
      />
    </>
  );
}
