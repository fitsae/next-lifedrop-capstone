import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "lifedrop123";

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const next = formData.get("next") || "/dashboard";

  const accounts = {
    "hospital@lifedrop.et": { id: "hospital-1", password: DEMO_PASSWORD },
    "admin@lifedrop.et": { id: "admin-1", password: DEMO_PASSWORD },
  };

  const account = accounts[email];
  if (!account || account.password !== password) {
    return new Response("Invalid credentials", { status: 401 });
  }

  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
  }

  const store = await cookies();
  store.set("session", account.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.redirect(new URL(next, request.url), 303);
}
