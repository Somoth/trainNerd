"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { insertSighting } from "@/db/queries";

export async function logSighting(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Sign in to log a sighting.");
  }

  const trainNumber = String(formData.get("trainNumber") ?? "").trim();
  const operator = String(formData.get("operator") ?? "").trim();
  const route = String(formData.get("route") ?? "").trim();
  const station = String(formData.get("station") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const isFavourite = formData.has("favourite");
  const isFirstTime = formData.has("firstTime");
  const isRare = formData.has("rare");

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
    station,
    country: country || undefined,
    note: note || undefined,
    isFavourite,
    isFirstTime,
    isRare,
    spottedAt: spottedAt.toISOString(),
  });

  revalidatePath("/");
}
