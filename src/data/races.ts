import type { Distance } from "@/lib/format";

export type Series = "major" | "superhalf";

export const SERIES: Record<Series, { label: string; name: string; url: string }> = {
  major: { label: "Major", name: "Abbott World Marathon Majors", url: "https://www.worldmarathonmajors.com" },
  superhalf: { label: "SuperHalf", name: "SuperHalfs", url: "https://superhalfs.com" },
};

export type CatalogRace = {
  slug: string;
  name: string;
  distance: Distance;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  /** Month the race is usually held (1-12) */
  month: number;
  website?: string;
  /** Race series it belongs to (World Marathon Majors / SuperHalfs) */
  series?: Series;
};

type Row = [
  slug: string,
  name: string,
  distance: Distance,
  city: string,
  country: string,
  cc: string,
  lat: number,
  lng: number,
  month: number,
  website?: string,
  series?: Series,
];

// Coordinates are approximate race-area locations (city level is fine for the map).
const rows: Row[] = [
  // ---- World Marathon Majors ----
  ["tokyo-marathon", "Tokyo Marathon", "FULL", "Tokyo", "Japan", "JP", 35.6895, 139.6917, 3, "https://www.marathon.tokyo", "major"],
  ["boston-marathon", "Boston Marathon", "FULL", "Boston", "United States", "US", 42.3496, -71.0782, 4, "https://www.baa.org", "major"],
  ["london-marathon", "London Marathon", "FULL", "London", "United Kingdom", "GB", 51.5033, -0.1276, 4, "https://www.londonmarathonevents.co.uk", "major"],
  ["sydney-marathon", "Sydney Marathon", "FULL", "Sydney", "Australia", "AU", -33.8568, 151.2153, 8, "https://www.sydneymarathon.com", "major"],
  ["berlin-marathon", "Berlin Marathon", "FULL", "Berlin", "Germany", "DE", 52.5163, 13.3777, 9, "https://www.bmw-berlin-marathon.com", "major"],
  ["chicago-marathon", "Chicago Marathon", "FULL", "Chicago", "United States", "US", 41.8757, -87.6243, 10, "https://www.chicagomarathon.com", "major"],
  ["new-york-marathon", "New York City Marathon", "FULL", "New York", "United States", "US", 40.7711, -73.9742, 11, "https://www.nyrr.org", "major"],

  // ---- Portugal ----
  ["lisbon-marathon", "EDP Lisbon Marathon", "FULL", "Lisbon", "Portugal", "PT", 38.7077, -9.1365, 10, "https://www.maratonalisboa.pt"],
  ["lisbon-half-vasco-da-gama", "Vasco da Gama Half Marathon", "HALF", "Lisbon", "Portugal", "PT", 38.7681, -9.0941, 10, "https://www.maratonalisboa.pt"],
  ["lisbon-half", "EDP Lisbon Half Marathon", "HALF", "Lisbon", "Portugal", "PT", 38.6897, -9.1771, 3, "https://www.maratonalisboa.pt", "superhalf"],
  ["porto-marathon", "EDP Porto Marathon", "FULL", "Porto", "Portugal", "PT", 41.1496, -8.6109, 11, "https://www.maratonadoporto.com"],
  ["porto-half", "Porto Half Marathon", "HALF", "Porto", "Portugal", "PT", 41.1579, -8.6291, 9],
  ["madeira-marathon", "Madeira Island Marathon", "FULL", "Funchal", "Portugal", "PT", 32.6497, -16.9086, 1],
  ["braga-half", "Braga Half Marathon", "HALF", "Braga", "Portugal", "PT", 41.5454, -8.4265, 3],
  ["nazare-half", "Nazaré Half Marathon", "HALF", "Nazaré", "Portugal", "PT", 39.6015, -9.071, 11],
  ["coimbra-half", "Coimbra Half Marathon", "HALF", "Coimbra", "Portugal", "PT", 40.2033, -8.4103, 5],
  ["aveiro-marathon", "Aveiro Marathon", "FULL", "Aveiro", "Portugal", "PT", 40.6405, -8.6538, 4],
  ["douro-vinhateiro-half", "Douro Vinhateiro Half Marathon", "HALF", "Peso da Régua", "Portugal", "PT", 41.1634, -7.788, 5],

  // ---- Spain ----
  ["valencia-marathon", "Valencia Marathon", "FULL", "Valencia", "Spain", "ES", 39.4553, -0.3531, 12, "https://www.valenciaciudaddelrunning.com"],
  ["valencia-half", "Valencia Half Marathon", "HALF", "Valencia", "Spain", "ES", 39.4553, -0.3531, 10, "https://www.valenciaciudaddelrunning.com", "superhalf"],
  ["barcelona-marathon", "Zurich Barcelona Marathon", "FULL", "Barcelona", "Spain", "ES", 41.373, 2.152, 3],
  ["barcelona-half", "eDreams Barcelona Half Marathon", "HALF", "Barcelona", "Spain", "ES", 41.3947, 2.2003, 2],
  ["madrid-marathon", "Madrid Marathon", "FULL", "Madrid", "Spain", "ES", 40.4168, -3.7038, 4],
  ["madrid-half", "Madrid Half Marathon", "HALF", "Madrid", "Spain", "ES", 40.4168, -3.7038, 3],
  ["seville-marathon", "Zurich Seville Marathon", "FULL", "Seville", "Spain", "ES", 37.3891, -5.9845, 2],
  ["malaga-marathon", "Málaga Marathon", "FULL", "Málaga", "Spain", "ES", 36.7213, -4.4214, 12],
  ["san-sebastian-marathon", "San Sebastián Marathon", "FULL", "San Sebastián", "Spain", "ES", 43.3183, -1.9812, 11],

  // ---- France ----
  ["paris-marathon", "Paris Marathon", "FULL", "Paris", "France", "FR", 48.8738, 2.295, 4],
  ["paris-half", "Paris Half Marathon", "HALF", "Paris", "France", "FR", 48.835, 2.438, 3],
  ["nice-cannes-marathon", "Nice-Cannes Marathon", "FULL", "Nice", "France", "FR", 43.6953, 7.2656, 11],
  ["lille-half", "Lille Half Marathon", "HALF", "Lille", "France", "FR", 50.6292, 3.0573, 9],
  ["bordeaux-marathon", "Bordeaux Métropole Marathon", "FULL", "Bordeaux", "France", "FR", 44.8378, -0.5792, 4],

  // ---- United Kingdom & Ireland ----
  ["great-north-run", "Great North Run", "HALF", "Newcastle", "United Kingdom", "GB", 54.9783, -1.6178, 9, "https://www.greatrun.org"],
  ["london-landmarks-half", "London Landmarks Half Marathon", "HALF", "London", "United Kingdom", "GB", 51.5072, -0.115, 4],
  ["hackney-half", "Hackney Half Marathon", "HALF", "London", "United Kingdom", "GB", 51.545, -0.0553, 5],
  ["bath-half", "Bath Half Marathon", "HALF", "Bath", "United Kingdom", "GB", 51.3811, -2.359, 3],
  ["cardiff-half", "Cardiff Half Marathon", "HALF", "Cardiff", "United Kingdom", "GB", 51.4816, -3.1791, 10, undefined, "superhalf"],
  ["manchester-marathon", "Manchester Marathon", "FULL", "Manchester", "United Kingdom", "GB", 53.4631, -2.2913, 4],
  ["brighton-marathon", "Brighton Marathon", "FULL", "Brighton", "United Kingdom", "GB", 50.8225, -0.1372, 4],
  ["edinburgh-marathon", "Edinburgh Marathon", "FULL", "Edinburgh", "United Kingdom", "GB", 55.9533, -3.1883, 5],
  ["dublin-marathon", "Dublin Marathon", "FULL", "Dublin", "Ireland", "IE", 53.3498, -6.2603, 10],

  // ---- Benelux ----
  ["amsterdam-marathon", "TCS Amsterdam Marathon", "FULL", "Amsterdam", "Netherlands", "NL", 52.3435, 4.8546, 10],
  ["rotterdam-marathon", "Rotterdam Marathon", "FULL", "Rotterdam", "Netherlands", "NL", 51.9225, 4.4792, 4],
  ["cpc-den-haag", "CPC Loop Den Haag", "HALF", "The Hague", "Netherlands", "NL", 52.0705, 4.3007, 3],
  ["egmond-half", "Egmond Half Marathon", "HALF", "Egmond aan Zee", "Netherlands", "NL", 52.6205, 4.6293, 1],
  ["brussels-marathon", "Brussels Marathon", "FULL", "Brussels", "Belgium", "BE", 50.8503, 4.3517, 10],

  // ---- Germany, Austria, Switzerland ----
  ["berlin-half", "Berlin Half Marathon", "HALF", "Berlin", "Germany", "DE", 52.5163, 13.3777, 4, undefined, "superhalf"],
  ["frankfurt-marathon", "Frankfurt Marathon", "FULL", "Frankfurt", "Germany", "DE", 50.1109, 8.6821, 10],
  ["hamburg-marathon", "Hamburg Marathon", "FULL", "Hamburg", "Germany", "DE", 53.5511, 9.9937, 4],
  ["munich-marathon", "Munich Marathon", "FULL", "Munich", "Germany", "DE", 48.1731, 11.5467, 10],
  ["vienna-marathon", "Vienna City Marathon", "FULL", "Vienna", "Austria", "AT", 48.2082, 16.3738, 4],
  ["zurich-marathon", "Zurich Marathon", "FULL", "Zurich", "Switzerland", "CH", 47.3769, 8.5417, 4],

  // ---- Italy ----
  ["rome-marathon", "Run Rome The Marathon", "FULL", "Rome", "Italy", "IT", 41.8902, 12.4922, 3],
  ["roma-ostia-half", "Roma-Ostia Half Marathon", "HALF", "Rome", "Italy", "IT", 41.7327, 12.2785, 3],
  ["florence-marathon", "Florence Marathon", "FULL", "Florence", "Italy", "IT", 43.7696, 11.2558, 11],
  ["venice-marathon", "Venice Marathon", "FULL", "Venice", "Italy", "IT", 45.4408, 12.3155, 10],
  ["milano-marathon", "Milano Marathon", "FULL", "Milan", "Italy", "IT", 45.4642, 9.19, 4],

  // ---- Nordics, Central & Eastern Europe ----
  ["copenhagen-marathon", "Copenhagen Marathon", "FULL", "Copenhagen", "Denmark", "DK", 55.6761, 12.5683, 5],
  ["copenhagen-half", "Copenhagen Half Marathon", "HALF", "Copenhagen", "Denmark", "DK", 55.6761, 12.5683, 9, undefined, "superhalf"],
  ["stockholm-marathon", "Stockholm Marathon", "FULL", "Stockholm", "Sweden", "SE", 59.3293, 18.0686, 6],
  ["goteborgsvarvet", "Göteborgsvarvet", "HALF", "Gothenburg", "Sweden", "SE", 57.7089, 11.9746, 5],
  ["oslo-marathon", "Oslo Marathon", "FULL", "Oslo", "Norway", "NO", 59.9139, 10.7522, 9],
  ["helsinki-marathon", "Helsinki City Marathon", "FULL", "Helsinki", "Finland", "FI", 60.1699, 24.9384, 8],
  ["prague-marathon", "Prague Marathon", "FULL", "Prague", "Czechia", "CZ", 50.0875, 14.4213, 5],
  ["prague-half", "Prague Half Marathon", "HALF", "Prague", "Czechia", "CZ", 50.0875, 14.4213, 4, undefined, "superhalf"],
  ["budapest-marathon", "Budapest Marathon", "FULL", "Budapest", "Hungary", "HU", 47.4979, 19.0402, 10],
  ["warsaw-marathon", "Warsaw Marathon", "FULL", "Warsaw", "Poland", "PL", 52.2297, 21.0122, 9],
  ["athens-marathon", "Athens Marathon – The Authentic", "FULL", "Athens", "Greece", "GR", 37.9681, 23.741, 11],
  ["istanbul-marathon", "Istanbul Marathon", "FULL", "Istanbul", "Türkiye", "TR", 41.0082, 28.9784, 11],
  ["istanbul-half", "Istanbul Half Marathon", "HALF", "Istanbul", "Türkiye", "TR", 41.0082, 28.9784, 4],

  // ---- North America ----
  ["nyc-half", "NYC Half", "HALF", "New York", "United States", "US", 40.6782, -73.9442, 3],
  ["brooklyn-half", "Brooklyn Half Marathon", "HALF", "New York", "United States", "US", 40.5755, -73.9707, 5],
  ["los-angeles-marathon", "Los Angeles Marathon", "FULL", "Los Angeles", "United States", "US", 34.0522, -118.2437, 3],
  ["marine-corps-marathon", "Marine Corps Marathon", "FULL", "Arlington", "United States", "US", 38.8799, -77.1068, 10],
  ["honolulu-marathon", "Honolulu Marathon", "FULL", "Honolulu", "United States", "US", 21.2793, -157.8292, 12],
  ["houston-marathon", "Houston Marathon", "FULL", "Houston", "United States", "US", 29.7604, -95.3698, 1],
  ["houston-half", "Houston Half Marathon", "HALF", "Houston", "United States", "US", 29.7604, -95.3698, 1],
  ["philadelphia-marathon", "Philadelphia Marathon", "FULL", "Philadelphia", "United States", "US", 39.9656, -75.181, 11],
  ["twin-cities-marathon", "Twin Cities Marathon", "FULL", "Minneapolis", "United States", "US", 44.9778, -93.265, 10],
  ["toronto-marathon", "TCS Toronto Waterfront Marathon", "FULL", "Toronto", "Canada", "CA", 43.6532, -79.3832, 10],
  ["mexico-city-marathon", "Mexico City Marathon", "FULL", "Mexico City", "Mexico", "MX", 19.4326, -99.1332, 8],

  // ---- South America & Africa ----
  ["buenos-aires-marathon", "Buenos Aires Marathon", "FULL", "Buenos Aires", "Argentina", "AR", -34.6037, -58.3816, 9],
  ["rio-marathon", "Rio de Janeiro Marathon", "FULL", "Rio de Janeiro", "Brazil", "BR", -22.9068, -43.1729, 6],
  ["sao-paulo-marathon", "São Paulo Marathon", "FULL", "São Paulo", "Brazil", "BR", -23.5505, -46.6333, 4],
  ["cape-town-marathon", "Cape Town Marathon", "FULL", "Cape Town", "South Africa", "ZA", -33.9249, 18.4241, 10],
  ["marrakech-marathon", "Marrakech Marathon", "FULL", "Marrakech", "Morocco", "MA", 31.6295, -7.9811, 1],

  // ---- Asia, Middle East & Oceania ----
  ["osaka-marathon", "Osaka Marathon", "FULL", "Osaka", "Japan", "JP", 34.6937, 135.5023, 2],
  ["seoul-marathon", "Seoul Marathon", "FULL", "Seoul", "South Korea", "KR", 37.5665, 126.978, 3],
  ["shanghai-marathon", "Shanghai Marathon", "FULL", "Shanghai", "China", "CN", 31.2304, 121.4737, 11],
  ["singapore-marathon", "Singapore Marathon", "FULL", "Singapore", "Singapore", "SG", 1.2903, 103.852, 12],
  ["dubai-marathon", "Dubai Marathon", "FULL", "Dubai", "United Arab Emirates", "AE", 25.2048, 55.2708, 1],
  ["rak-half", "Ras Al Khaimah Half Marathon", "HALF", "Ras Al Khaimah", "United Arab Emirates", "AE", 25.7895, 55.9432, 2],
  ["melbourne-marathon", "Melbourne Marathon", "FULL", "Melbourne", "Australia", "AU", -37.82, 144.9834, 10],
  ["gold-coast-marathon", "Gold Coast Marathon", "FULL", "Gold Coast", "Australia", "AU", -28.0167, 153.4, 7],
  ["auckland-marathon", "Auckland Marathon", "FULL", "Auckland", "New Zealand", "NZ", -36.8485, 174.7633, 11],
];

export const RACES: CatalogRace[] = rows.map(
  ([slug, name, distance, city, country, countryCode, lat, lng, month, website, series]) => ({
    slug,
    name,
    distance,
    city,
    country,
    countryCode,
    lat,
    lng,
    month,
    website,
    series,
  }),
);

export function getRace(slug: string | null | undefined): CatalogRace | undefined {
  return slug ? RACES.find((r) => r.slug === slug) : undefined;
}

export const COUNTRIES = [...new Map(RACES.map((r) => [r.country, r.countryCode])).entries()]
  .map(([name, code]) => ({ name, code }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function countryCodeFor(country: string): string | undefined {
  return COUNTRIES.find((c) => c.name.toLowerCase() === country.trim().toLowerCase())?.code;
}

/**
 * Series for a logged run: by catalog slug, or by exact race name
 * for runs that were added manually.
 */
export function seriesForRun(run: { raceSlug: string | null; name: string }): Series | undefined {
  const name = run.name.trim().toLowerCase();
  return (getRace(run.raceSlug) ?? RACES.find((r) => r.name.toLowerCase() === name))?.series;
}
