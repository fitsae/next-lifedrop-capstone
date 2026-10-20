import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const store = await cookies();
  store.delete("session");
  return NextResponse.redirect(new URL("/", request.url), 303);
}
