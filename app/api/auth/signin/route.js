import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@lifedrop.et";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "lifedrop123";

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = formData.get("password");
  const next = formData.get("next") || "/dashboard";

  if (email === ADMIN_EMAIL && password === DEMO_PASSWORD) {
    return redirectWithSession(request, "admin", next);
  }

  if (!email || !email.includes("@")) {
    return new Response("Invalid credentials", { status: 401 });
  }

  return redirectWithSession(request, `hospital:${email}`, next);
}

function redirectWithSession(request, userId, next) {
  const safeNext =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/dashboard";

  const response = NextResponse.redirect(new URL(safeNext, request.url), 303);

  // Do NOT let Next URL-encode the value.
  response.headers.append(
    "Set-Cookie",
    `session=${userId}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }; HttpOnly`,
  );

  return response;
}
