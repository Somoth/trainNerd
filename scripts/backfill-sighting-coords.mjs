import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Mirrors src/lib/geocode.ts — duplicated here since this script runs as
// plain Node (no TS/bundler) and is small enough not to be worth a shared
// runtime module for a one-off backfill.
async function geocodeStation(station, country) {
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
    if (!res.ok) return null;
    const results = await res.json();
    const first = results[0];
    if (!first) return null;
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const rows = await sql`
  SELECT id, station, country FROM sightings WHERE lat IS NULL OR lng IS NULL
`;

console.log(`Backfilling coordinates for ${rows.length} sighting(s)...`);

for (const row of rows) {
  const point = await geocodeStation(row.station, row.country ?? undefined);
  if (point) {
    await sql`UPDATE sightings SET lat = ${point.lat}, lng = ${point.lng} WHERE id = ${row.id}`;
    console.log(`  #${row.id} ${row.station} -> ${point.lat}, ${point.lng}`);
  } else {
    console.log(`  #${row.id} ${row.station} -> no match, left null`);
  }
  await sleep(1100); // stay under Nominatim's ~1 req/sec usage policy
}

console.log("done");
