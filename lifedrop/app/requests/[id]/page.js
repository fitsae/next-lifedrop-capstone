"use client";

import { use } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function RequestDetailPage({ params }) {
  const { id } = use(params);
  const hydrated = useHydrated();

  // Two separate primitive/stable selectors — no new arrays or objects.
  const request = useStore((s) => s.requests.find((r) => r.id === id));
  const hospital = useStore((s) =>
    s.hospitals.find((h) => h.id === request?.hospitalId),
  );

  if (!hydrated) return <p>Loading…</p>;

  if (!request) {
    return (
      <div className="card">
        <h1>Request not found</h1>
        <Link href="/requests" className="btn btn-outline">
          Back to requests
        </Link>
      </div>
    );
  }

  return (
    <article className="card">
      <Link href="/requests" className="text-muted">
        ← Back to requests
      </Link>
      <div className="flex items-center gap-2 mt-4 mb-2">
        <span className="badge badge-blood">{request.bloodType}</span>
        <span className={`badge badge-${request.urgency}`}>
          {request.urgency}
        </span>
      </div>
      <h1>{request.bloodType} blood needed</h1>
      <p className="text-muted">
        {request.units} units at {request.hospital}, {request.city}.
      </p>

      <div className="card">
        <h3>Hospital</h3>
        <p>{request.hospital}</p>
        <p className="text-muted">{request.city}</p>
      </div>

      {hospital && (
        <div className="card">
          <h3>Contact the hospital directly</h3>
          <p>
            <a href={`tel:${hospital.phone}`} className="btn btn-primary">
              Call {hospital.phone}
            </a>
          </p>
        </div>
      )}

      {request.notes && (
        <div className="card">
          <h3>Notes</h3>
          <p>{request.notes}</p>
        </div>
      )}
    </article>
  );
}
