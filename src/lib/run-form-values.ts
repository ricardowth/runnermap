import type { CatalogRace } from "@/data/races";
import type { Distance } from "@/lib/format";

export type RunFormValues = {
  name: string;
  distance: Distance;
  date: string;
  bibNumber: string;
  finishTime: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  notes: string;
  raceSlug: string;
};

export const EMPTY_RUN: RunFormValues = {
  name: "",
  distance: "FULL",
  date: "",
  bibNumber: "",
  finishTime: "",
  city: "",
  country: "",
  lat: null,
  lng: null,
  notes: "",
  raceSlug: "",
};

export function raceToValues(race: CatalogRace): Partial<RunFormValues> {
  return {
    name: race.name,
    distance: race.distance,
    city: race.city,
    country: race.country,
    lat: race.lat,
    lng: race.lng,
    raceSlug: race.slug,
  };
}
