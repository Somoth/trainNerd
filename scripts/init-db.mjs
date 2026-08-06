import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS sightings (
    id serial PRIMARY KEY,
    loco_class text NOT NULL,
    loco_number text,
    category text NOT NULL,
    location text NOT NULL,
    note text,
    miles integer NOT NULL DEFAULT 0,
    spotted_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS sightings_spotted_at_idx ON sightings (spotted_at DESC)
`;

console.log("sightings table ready");
