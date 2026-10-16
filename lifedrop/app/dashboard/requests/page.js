import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getRequestsByOwner } from "@/lib/requests";
import AddRequestForm from "@/components/AddRequestForm";

export const metadata = {
  title: "Manage Requests",
  robots: { index: false, follow: false },
};

export default async function ManageRequestsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/requests");

  const own = getRequestsByOwner(session.userId);

  return (
    <div>
      <h1>Manage Requests</h1>

      <div className="grid grid-2">
        <section>
          <h2>Your requests</h2>
          {own.length === 0 ? (
            <p className="text-muted">You have not posted any requests yet.</p>
          ) : (
            own.map((r) => (
              <article key={r.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-blood">{r.bloodType}</span>
                  <span className={`badge badge-${r.urgency}`}>
                    {r.urgency}
                  </span>
                </div>
                <h3>
                  <Link href={`/requests/${r.id}`}>{r.hospital}</Link>
                </h3>
                <p className="text-muted">
                  {r.city} · {r.units} unit(s)
                </p>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Status: {r.status}
                </p>
              </article>
            ))
          )}
        </section>

        <section>
          <h2>Post a new request</h2>
          <AddRequestForm />
        </section>
      </div>
    </div>
  );
}
