"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseDuration } from "@/lib/format";

export type RunFormState = {
  errors?: Partial<Record<string, string>>;
  message?: string;
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const RunSchema = z.object({
  name: z.string().trim().min(1, "Give the race a name").max(120),
  distance: z.enum(["HALF", "FULL"], { message: "Pick a distance" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  bibNumber: optionalText(20),
  finishTime: z.string(),
  city: z.string().trim().min(1, "City is required").max(80),
  country: z.string().trim().min(1, "Country is required").max(80),
  lat: z.coerce.number({ message: "Pick a location on the map" }).min(-90).max(90),
  lng: z.coerce.number({ message: "Pick a location on the map" }).min(-180).max(180),
  notes: optionalText(1000),
  raceSlug: optionalText(100),
});

function parseRun(formData: FormData) {
  const raw = Object.fromEntries(
    ["name", "distance", "date", "bibNumber", "finishTime", "city", "country", "lat", "lng", "notes", "raceSlug"].map(
      (k) => [k, String(formData.get(k) ?? "")],
    ),
  );
  if (!raw.lat || !raw.lng) {
    return { errors: { location: "Pick a location on the map or search for a city" } } as const;
  }

  const parsed = RunSchema.safeParse(raw);
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key === "lat" || key === "lng" ? "location" : key] ??= issue.message;
    }
  }

  const seconds = parseDuration(raw.finishTime);
  if (seconds !== null && (Number.isNaN(seconds) || seconds <= 0 || seconds > 24 * 3600)) {
    errors.finishTime = "Use h:mm:ss, e.g. 3:45:12";
  }

  if (!parsed.success || Object.keys(errors).length) return { errors } as const;

  const { finishTime: _ignored, date, ...rest } = parsed.data;
  return { data: { ...rest, date: new Date(`${date}T00:00:00.000Z`), finishTime: seconds } } as const;
}

export async function createRun(_prev: RunFormState, formData: FormData): Promise<RunFormState> {
  const user = await requireUser();
  const result = parseRun(formData);
  if ("errors" in result) return { errors: result.errors, message: "Please fix the highlighted fields." };

  await prisma.run.create({ data: { ...result.data, userId: user.id } });
  revalidatePath("/", "layout");
  redirect("/runs");
}

export async function updateRun(id: string, _prev: RunFormState, formData: FormData): Promise<RunFormState> {
  const user = await requireUser();
  const result = parseRun(formData);
  if ("errors" in result) return { errors: result.errors, message: "Please fix the highlighted fields." };

  const { count } = await prisma.run.updateMany({ where: { id, userId: user.id }, data: result.data });
  if (count === 0) return { message: "This run no longer exists." };
  revalidatePath("/", "layout");
  redirect("/runs");
}

export async function deleteRun(id: string) {
  const user = await requireUser();
  await prisma.run.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/", "layout");
}
