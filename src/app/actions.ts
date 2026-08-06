"use server";

import { revalidatePath } from "next/cache";
import { insertSighting } from "@/db/queries";
import { CATEGORIES } from "@/lib/categories";

export async function logSighting(formData: FormData) {
  const locoClass = String(formData.get("locoClass") ?? "").trim();
  const locoNumber = String(formData.get("locoNumber") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const milesRaw = String(formData.get("miles") ?? "").trim();
  const spottedAtRaw = String(formData.get("spottedAt") ?? "").trim();

  if (!locoClass || !location || !CATEGORIES.includes(category)) {
    throw new Error("Class, category, and location are required.");
  }

  await insertSighting({
    locoClass,
    locoNumber: locoNumber || undefined,
    category,
    location,
    note: note || undefined,
    miles: milesRaw ? Number(milesRaw) : 0,
    spottedAt: spottedAtRaw ? new Date(spottedAtRaw).toISOString() : undefined,
  });

  revalidatePath("/");
}
