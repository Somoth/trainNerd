import { getDb } from "./index";

export type PlannedRide = {
  id: number;
  trainNumber: string | null;
  operator: string | null;
  route: string | null;
  plannedDate: string;
  note: string | null;
  isDone: boolean;
  rating: number | null;
  doneAt: string | null;
  createdAt: string;
};

type PlannedRideRow = {
  id: number;
  train_number: string | null;
  operator: string | null;
  route: string | null;
  planned_date: Date;
  note: string | null;
  is_done: boolean;
  rating: number | null;
  done_at: string | null;
  created_at: string;
};

// The driver parses Postgres DATE columns into a Date at local midnight,
// so pull the calendar date back out with local getters (not toISOString,
// which would shift the date on a server whose TZ isn't UTC).
function toDateOnlyString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toPlannedRide(r: PlannedRideRow): PlannedRide {
  return {
    id: r.id,
    trainNumber: r.train_number,
    operator: r.operator,
    route: r.route,
    plannedDate: toDateOnlyString(r.planned_date),
    note: r.note,
    isDone: r.is_done,
    rating: r.rating,
    doneAt: r.done_at,
    createdAt: r.created_at,
  };
}

export async function getPlannedRides(userId: string): Promise<PlannedRide[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, train_number, operator, route, planned_date, note,
           is_done, rating, done_at, created_at
    FROM planned_rides
    WHERE user_id = ${userId}
    ORDER BY is_done ASC, planned_date ASC
  `) as PlannedRideRow[];
  return rows.map(toPlannedRide);
}

export async function insertPlannedRide(
  userId: string,
  data: {
    trainNumber?: string;
    operator?: string;
    route?: string;
    plannedDate: string;
    note?: string;
  },
) {
  const sql = getDb();
  await sql`
    INSERT INTO planned_rides (user_id, train_number, operator, route, planned_date, note)
    VALUES (
      ${userId},
      ${data.trainNumber ?? null},
      ${data.operator ?? null},
      ${data.route ?? null},
      ${data.plannedDate},
      ${data.note ?? null}
    )
  `;
}

export async function markPlannedRideDone(userId: string, id: number, rating: number) {
  const sql = getDb();
  const rows = (await sql`
    UPDATE planned_rides
    SET is_done = TRUE, rating = ${rating}, done_at = now()
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id
  `) as { id: number }[];
  if (rows.length === 0) {
    throw new Error("Ride not found.");
  }
}
