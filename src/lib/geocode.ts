export type GeoPoint = { lat: number; lng: number };

type NominatimResult = { lat: string; lon: string };

// Best-effort geocoding via OpenStreetMap's Nominatim — free, keyless, but
// rate-limited to ~1 req/sec and requires a descriptive User-Agent. Never
// throws: a bad/unfindable station name should never block logging a sighting.
// No "train station" suffix — Nominatim's free-text search resolves named
// stations directly (e.g. "Frankfurt Hbf") and falls back to the city
// centroid otherwise; appending words to the query breaks both cases.
export async function geocodeStation(
  station: string,
  country?: string,
): Promise<GeoPoint | null> {
  const query = [station, country].filter(Boolean).join(", ");
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "trainNerd (personal train-spotting log)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`geocodeStation: Nominatim returned ${res.status} for "${query}"`);
      return null;
    }
    const results = (await res.json()) as NominatimResult[];
    const first = results[0];
    if (!first) {
      console.error(`geocodeStation: no match for "${query}"`);
      return null;
    }
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }
    return { lat, lng };
  } catch (err) {
    console.error(`geocodeStation: request failed for "${query}"`, err);
    return null;
  }
}
