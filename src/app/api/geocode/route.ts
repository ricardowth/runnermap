import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

// Thin proxy to OpenStreetMap Nominatim so we can send a proper User-Agent
// (required by their usage policy: https://operations.osmfoundation.org/policies/nominatim/).
const NOMINATIM = "https://nominatim.openstreetmap.org";
const HEADERS = { "User-Agent": "RunnerMap/0.1 (personal race map)", "Accept-Language": "en" };

type NominatimPlace = {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string | undefined>;
};

export type GeocodeResult = { label: string; city: string; country: string; lat: number; lng: number };

function toResult(p: NominatimPlace): GeocodeResult {
  const a = p.address ?? {};
  return {
    label: p.display_name,
    city: a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? a.state ?? "",
    country: a.country ?? "",
    lat: Number(p.lat),
    lng: Number(p.lon),
  };
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  try {
    if (q) {
      const url = `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: HEADERS, next: { revalidate: 86400 } });
      const data = (await res.json()) as NominatimPlace[];
      return NextResponse.json(data.map(toResult));
    }
    if (lat && lng) {
      const url = `${NOMINATIM}/reverse?format=jsonv2&zoom=10&lat=${Number(lat)}&lon=${Number(lng)}`;
      const res = await fetch(url, { headers: HEADERS, next: { revalidate: 86400 } });
      const data = (await res.json()) as NominatimPlace;
      return NextResponse.json(data?.address ? [toResult(data)] : []);
    }
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
  }
  return NextResponse.json({ error: "Provide q or lat/lng" }, { status: 400 });
}
