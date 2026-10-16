import { cookies } from "next/headers";

const ACCOUNTS = {
  "hospital-1": {
    userId: "hospital-1",
    email: "hospital@lifedrop.et",
    name: "Black Lion Hospital",
    role: "hospital",
  },
  "admin-1": {
    userId: "admin-1",
    email: "admin@lifedrop.et",
    name: "LifeDrop Admin",
    role: "admin",
  },
};

export async function getSession() {
  const store = await cookies();
  const userId = store.get("session")?.value;
  if (!userId) return null;
  return ACCOUNTS[userId] ?? null;
}
