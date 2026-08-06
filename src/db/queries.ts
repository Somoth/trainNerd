import { getDb } from "./index";

export type Sighting = {
  id: number;
  trainNumber: string;
  operator: string | null;
  route: string | null;
  origin: string | null;
  destination: string | null;
  station: string;
  country: string | null;
  note: string | null;
  miles: number;
  spottedAt: string;
};

type SightingRow = {
  id: number;
  train_number: string;
  operator: string | null;
  route: string | null;
  origin: string | null;
  destination: string | null;
  station: string;
  country: string | null;
  note: string | null;
  miles: number;
  spotted_at: string;
};

export async function getSightings(limit = 20): Promise<Sighting[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, train_number, operator, route, origin, destination, station, country, note, miles, spotted_at
    FROM sightings
    ORDER BY spotted_at DESC
    LIMIT ${limit}
  `) as SightingRow[];
  return rows.map((r) => ({
    id: r.id,
    trainNumber: r.train_number,
    operator: r.operator,
    route: r.route,
    origin: r.origin,
    destination: r.destination,
    station: r.station,
    country: r.country,
    note: r.note,
    miles: r.miles,
    spottedAt: r.spotted_at,
  }));
}

export type Stats = {
  trainsSpotted: number;
  stationsVisited: number;
  milesLogged: number;
};

type StatsRow = {
  trains_spotted: number;
  stations_visited: number;
  miles_logged: number;
};

export async function getStats(): Promise<Stats> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      COUNT(DISTINCT train_number)::int AS trains_spotted,
      COUNT(DISTINCT station)::int AS stations_visited,
      COALESCE(SUM(miles), 0)::int AS miles_logged
    FROM sightings
  `) as StatsRow[];
  const row = rows[0];
  return {
    trainsSpotted: row.trains_spotted,
    stationsVisited: row.stations_visited,
    milesLogged: row.miles_logged,
  };
}

export async function insertSighting(data: {
  trainNumber: string;
  operator?: string;
  route?: string;
  origin?: string;
  destination?: string;
  station: string;
  country?: string;
  note?: string;
  miles?: number;
  spottedAt?: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO sightings (train_number, operator, route, origin, destination, station, country, note, miles, spotted_at)
    VALUES (
      ${data.trainNumber},
      ${data.operator ?? null},
      ${data.route ?? null},
      ${data.origin ?? null},
      ${data.destination ?? null},
      ${data.station},
      ${data.country ?? null},
      ${data.note ?? null},
      ${data.miles ?? 0},
      ${data.spottedAt ?? new Date().toISOString()}
    )
  `;
}
