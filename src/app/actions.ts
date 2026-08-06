"use server";

import { revalidatePath } from "next/cache";
import { insertSighting } from "@/db/queries";

export async function logSighting(formData: FormData) {
  const trainNumber = String(formData.get("trainNumber") ?? "").trim();
  const operator = String(formData.get("operator") ?? "").trim();
  const route = String(formData.get("route") ?? "").trim();
  const origin = String(formData.get("origin") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const station = String(formData.get("station") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const milesRaw = String(formData.get("miles") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();

  if (!trainNumber || !station || !date || !time) {
    throw new Error("Train number, station, date, and time are required.");
  }

  const spottedAt = new Date(`${date}T${time}`);
  if (Number.isNaN(spottedAt.getTime())) {
    throw new Error("That date and time couldn't be read.");
  }

  await insertSighting({
    trainNumber,
    operator: operator || undefined,
    route: route || undefined,
    origin: origin || undefined,
    destination: destination || undefined,
    station,
    country: country || undefined,
    note: note || undefined,
    miles: milesRaw ? Number(milesRaw) : 0,
    spottedAt: spottedAt.toISOString(),
  });

  revalidatePath("/");
}
