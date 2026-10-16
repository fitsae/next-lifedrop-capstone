import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getRequestsByOwner } from "@/lib/requests";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  const own = getRequestsByOwner(session.userId);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="text-muted">
        Signed in as {session.name} ({session.role}).
      </p>

      <div className="grid grid-3 mb-6">
        <div className="card">
          <p className="text-muted">Your open requests</p>
          <h2 style={{ fontSize: "2rem" }}>
            {own.filter((r) => r.status === "open").length}
          </h2>
        </div>
        <div className="card">
          <p className="text-muted">Total requests posted</p>
          <h2 style={{ fontSize: "2rem" }}>{own.length}</h2>
        </div>
      </div>

      <Link href="/dashboard/requests" className="btn btn-primary">
        Manage requests →
      </Link>
    </div>
  );
}
