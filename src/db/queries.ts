import { getDb } from "./index";

export type Sighting = {
  id: number;
  locoClass: string;
  locoNumber: string | null;
  category: string;
  location: string;
  note: string | null;
  miles: number;
  spottedAt: string;
};

type SightingRow = {
  id: number;
  loco_class: string;
  loco_number: string | null;
  category: string;
  location: string;
  note: string | null;
  miles: number;
  spotted_at: string;
};

export async function getSightings(limit = 20): Promise<Sighting[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, loco_class, loco_number, category, location, note, miles, spotted_at
    FROM sightings
    ORDER BY spotted_at DESC
    LIMIT ${limit}
  `) as SightingRow[];
  return rows.map((r) => ({
    id: r.id,
    locoClass: r.loco_class,
    locoNumber: r.loco_number,
    category: r.category,
    location: r.location,
    note: r.note,
    miles: r.miles,
    spottedAt: r.spotted_at,
  }));
}

export type Stats = {
  classesSpotted: number;
  stationsVisited: number;
  milesLogged: number;
};

type StatsRow = {
  classes_spotted: number;
  stations_visited: number;
  miles_logged: number;
};

export async function getStats(): Promise<Stats> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      COUNT(DISTINCT loco_class)::int AS classes_spotted,
      COUNT(DISTINCT location)::int AS stations_visited,
      COALESCE(SUM(miles), 0)::int AS miles_logged
    FROM sightings
  `) as StatsRow[];
  const row = rows[0];
  return {
    classesSpotted: row.classes_spotted,
    stationsVisited: row.stations_visited,
    milesLogged: row.miles_logged,
  };
}

export async function insertSighting(data: {
  locoClass: string;
  locoNumber?: string;
  category: string;
  location: string;
  note?: string;
  miles?: number;
  spottedAt?: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO sightings (loco_class, loco_number, category, location, note, miles, spotted_at)
    VALUES (
      ${data.locoClass},
      ${data.locoNumber ?? null},
      ${data.category},
      ${data.location},
      ${data.note ?? null},
      ${data.miles ?? 0},
      ${data.spottedAt ?? new Date().toISOString()}
    )
  `;
}
