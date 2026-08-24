"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { insertPlannedRide, markPlannedRideDone } from "@/db/rides";

export async function addPlannedRide(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Sign in to plan a ride.");
  }

  const trainNumber = String(formData.get("trainNumber") ?? "").trim();
  const operator = String(formData.get("operator") ?? "").trim();
  const route = String(formData.get("route") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const plannedDate = String(formData.get("plannedDate") ?? "").trim();

  if (!route || !plannedDate) {
    throw new Error("Route and date are required.");
  }
  if (Number.isNaN(new Date(plannedDate).getTime())) {
    throw new Error("That date couldn't be read.");
  }

  await insertPlannedRide(userId, {
    trainNumber: trainNumber || undefined,
    operator: operator || undefined,
    route,
    note: note || undefined,
    plannedDate,
  });

  revalidatePath("/rides");
}

export async function markRideDone(id: number, rating: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Sign in to update a ride.");
  }
  if (!Number.isInteger(id)) {
    throw new Error("Invalid ride.");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  await markPlannedRideDone(userId, id, rating);

  revalidatePath("/rides");
}
