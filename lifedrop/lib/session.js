import { cookies } from "next/headers";

function parse(value) {
  if (!value) return null;
  if (value === "admin") {
    return {
      userId: "admin",
      role: "admin",
      email: "admin@lifedrop.et",
      name: "LifeDrop Admin",
    };
  }
  if (value.startsWith("hospital:")) {
    const email = value.slice("hospital:".length).trim().toLowerCase();
    return { userId: value, role: "hospital", email, name: email };
  }
  return null;
}

export async function getSession() {
  const store = await cookies();
  const raw = store.get("session")?.value;
  if (!raw) return null;

  // Try as-is first
  let session = parse(raw);
  if (session) return session;

  // Try decoded
  try {
    const decoded = decodeURIComponent(raw);
    session = parse(decoded);
    if (session) return session;
  } catch {}

  return null;
}

export function isAdmin(session) {
  return session?.role === "admin";
}

export function isHospital(session) {
  return session?.role === "hospital";
}
