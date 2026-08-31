import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`ALTER TABLE sightings ADD COLUMN IF NOT EXISTS lat double precision`;
await sql`ALTER TABLE sightings ADD COLUMN IF NOT EXISTS lng double precision`;

console.log("sightings.lat / sightings.lng ready");
