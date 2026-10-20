import { cookies, headers } from "next/headers";

export async function GET() {
  const store = await cookies();
  const h = await headers();
  return Response.json({
    rawCookieHeader: h.get("cookie") || "(none)",
    sessionCookie: store.get("session") || null,
    allCookies: store.getAll(),
  });
}
