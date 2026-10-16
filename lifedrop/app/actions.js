"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { addDonor } from "@/lib/donors";
import { requests } from "@/lib/requests";

export async function registerDonor(prevState, formData) {
  const name = formData.get("name")?.trim();
  const bloodType = formData.get("bloodType");
  const city = formData.get("city")?.trim();
  const phone = formData.get("phone")?.trim();
  const lastDonation = formData.get("lastDonation") || null;

  const errors = {};
  if (!name || name.length < 2) errors.name = "Enter your full name.";
  if (!bloodType) errors.bloodType = "Select a blood type.";
  if (!city) errors.city = "Enter your city.";
  if (!phone || !/^(?:\+251|0)9\d{8}$/.test(phone))
    errors.phone = "Enter a valid Ethiopian phone number (09XXXXXXXX).";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values: { name, bloodType, city, phone } };
  }

  addDonor({ name, bloodType, city, phone, lastDonation });
  return { success: true, message: "Thank you for registering as a donor." };
}

export async function createRequest(prevState, formData) {
  const session = await getSession();
  if (!session) return { success: false, error: "You must be signed in." };

  const bloodType = formData.get("bloodType");
  const city = formData.get("city")?.trim();
  const hospital = formData.get("hospital")?.trim();
  const units = Number(formData.get("units") || 1);
  const urgency = formData.get("urgency") || "medium";
  const notes = formData.get("notes")?.trim() || "";

  const errors = {};
  if (!bloodType) errors.bloodType = "Required.";
  if (!city) errors.city = "Required.";
  if (!hospital) errors.hospital = "Required.";
  if (!units || units < 1) errors.units = "Must be at least 1.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  requests.unshift({
    id: `req-${Date.now()}`,
    bloodType,
    city,
    hospital,
    contactName: session.name,
    contactPhone: "",
    urgency,
    units,
    notes,
    createdAt: new Date().toISOString(),
    status: "open",
    ownerId: session.userId,
  });

  revalidatePath("/dashboard/requests");
  revalidatePath("/requests");
  redirect("/dashboard/requests");
}

export async function signOutAction() {
  redirect("/api/auth/signout");
}
