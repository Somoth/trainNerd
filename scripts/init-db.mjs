import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`DROP TABLE IF EXISTS sightings`;

await sql`
  CREATE TABLE sightings (
    id serial PRIMARY KEY,
    train_number text NOT NULL,
    operator text,
    route text,
    station text NOT NULL,
    country text,
    note text,
    is_favourite boolean NOT NULL DEFAULT false,
    is_first_time boolean NOT NULL DEFAULT false,
    is_rare boolean NOT NULL DEFAULT false,
    lat double precision,
    lng double precision,
    spotted_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX sightings_spotted_at_idx ON sightings (spotted_at DESC)
`;

console.log("sightings table ready");
