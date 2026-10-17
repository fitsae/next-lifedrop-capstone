"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function HomePage() {
  const hydrated = useHydrated();
  const requests = useStore((s) => s.requests);

  const urgent = useMemo(
    () =>
      requests
        .filter((r) => r.status === "open" && r.urgency === "high")
        .slice(0, 3),
    [requests],
  );

  if (!hydrated) return <p>Loading…</p>;

  return (
    <div>
      <section className="hero">
        <h1>Find blood. Save a life.</h1>
        <p>Search for blood requests by type and city across Ethiopia.</p>
        <div className="mt-4">
          <Link href="/requests" className="btn btn-primary">
            Find a Request
          </Link>{" "}
          <Link href="/donate" className="btn btn-outline">
            Become a Donor
          </Link>
        </div>
      </section>

      <section className="mb-6">
        <h2>Urgent requests</h2>
        {urgent.length === 0 ? (
          <p className="text-muted">No urgent requests right now.</p>
        ) : (
          <div className="grid grid-3">
            {urgent.map((req) => (
              <article key={req.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-blood">{req.bloodType}</span>
                  <span className={`badge badge-${req.urgency}`}>
                    {req.urgency}
                  </span>
                </div>
                <h3>
                  <Link href={`/requests/${req.id}`}>{req.hospital}</Link>
                </h3>
                <p className="text-muted">{req.city}</p>
                <p className="text-muted">
                  {req.units} unit{req.units > 1 ? "s" : ""} needed
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>How LifeDrop works</h2>
        <div className="grid grid-3">
          <div className="card">
            <h3>1. Search</h3>
            <p className="text-muted">
              Filter by blood type and city to see open requests near you.
            </p>
          </div>
          <div className="card">
            <h3>2. Contact</h3>
            <p className="text-muted">
              Open a request to see the hospital&apos;s phone number.
            </p>
          </div>
          <div className="card">
            <h3>3. Donate</h3>
            <p className="text-muted">
              Visit the hospital and donate. One donation can save three lives.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
