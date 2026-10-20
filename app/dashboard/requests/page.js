"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useSession } from "@/lib/useSession";
import AddRequestForm from "@/components/AddRequestForm";

export default function ManageRequestsPage() {
  const session = useSession();
  const hospitals = useStore((s) => s.hospitals);
  const requests = useStore((s) => s.requests);

  if (session === undefined) return <p>Loading…</p>;

  if (!session || session.role !== "hospital") {
    return (
      <p className="text-muted">Sign in as a hospital to manage requests.</p>
    );
  }

  const hospital = useMemo(() => {
    if (!session?.email) return undefined;
    const norm = session.email.trim().toLowerCase();
    return hospitals.find((h) => h.email.trim().toLowerCase() === norm);
  }, [hospitals, session]);

  const own = requests.filter((r) => r.hospitalId === hospital.id);

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
                  {r.city} · {r.units} unit(s) · {r.status}
                </p>
              </article>
            ))
          )}
        </section>

        <section>
          <h2>Post a new request</h2>
          <AddRequestForm hospitalId={hospital.id} />
        </section>
      </div>
    </div>
  );
}
