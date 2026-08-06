import { getDb } from "./index";

export type Sighting = {
  id: number;
  trainNumber: string;
  operator: string | null;
  route: string | null;
  station: string;
  country: string | null;
  note: string | null;
  isFavourite: boolean;
  isFirstTime: boolean;
  isRare: boolean;
  spottedAt: string;
};

type SightingRow = {
  id: number;
  train_number: string;
  operator: string | null;
  route: string | null;
  station: string;
  country: string | null;
  note: string | null;
  is_favourite: boolean;
  is_first_time: boolean;
  is_rare: boolean;
  spotted_at: string;
};

export async function getSightings(limit = 20): Promise<Sighting[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, train_number, operator, route, station, country, note,
           is_favourite, is_first_time, is_rare, spotted_at
    FROM sightings
    ORDER BY spotted_at DESC
    LIMIT ${limit}
  `) as SightingRow[];
  return rows.map((r) => ({
    id: r.id,
    trainNumber: r.train_number,
    operator: r.operator,
    route: r.route,
    station: r.station,
    country: r.country,
    note: r.note,
    isFavourite: r.is_favourite,
    isFirstTime: r.is_first_time,
    isRare: r.is_rare,
    spottedAt: r.spotted_at,
  }));
}

export type Stats = {
  trainsSpotted: number;
  stationsVisited: number;
  rareSightings: number;
};

type StatsRow = {
  trains_spotted: number;
  stations_visited: number;
  rare_sightings: number;
};

export async function getStats(): Promise<Stats> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      COUNT(DISTINCT train_number)::int AS trains_spotted,
      COUNT(DISTINCT station)::int AS stations_visited,
      COUNT(*) FILTER (WHERE is_rare)::int AS rare_sightings
    FROM sightings
  `) as StatsRow[];
  const row = rows[0];
  return {
    trainsSpotted: row.trains_spotted,
    stationsVisited: row.stations_visited,
    rareSightings: row.rare_sightings,
  };
}

export async function insertSighting(data: {
  trainNumber: string;
  operator?: string;
  route?: string;
  station: string;
  country?: string;
  note?: string;
  isFavourite?: boolean;
  isFirstTime?: boolean;
  isRare?: boolean;
  spottedAt?: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO sightings (train_number, operator, route, station, country, note, is_favourite, is_first_time, is_rare, spotted_at)
    VALUES (
      ${data.trainNumber},
      ${data.operator ?? null},
      ${data.route ?? null},
      ${data.station},
      ${data.country ?? null},
      ${data.note ?? null},
      ${data.isFavourite ?? false},
      ${data.isFirstTime ?? false},
      ${data.isRare ?? false},
      ${data.spottedAt ?? new Date().toISOString()}
    )
  `;
}
