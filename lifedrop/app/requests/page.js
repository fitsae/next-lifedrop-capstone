"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const BLOOD_TYPES = ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function RequestsPage() {
  const hydrated = useHydrated();
  const requests = useStore((s) => s.requests);

  const [bloodType, setBloodType] = useState("");
  const [city, setCity] = useState("");

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        if (r.status !== "open") return false;
        if (bloodType && r.bloodType !== bloodType) return false;
        if (city && !r.city.toLowerCase().includes(city.toLowerCase()))
          return false;
        return true;
      }),
    [requests, bloodType, city],
  );

  if (!hydrated) return <p>Loading…</p>;

  return (
    <div>
      <h1>Blood Requests</h1>
      <div className="card mb-6">
        <div className="form-row">
          <label>Blood type</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
          >
            {BLOOD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t || "Any"}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Addis Ababa"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">No matching requests.</p>
      ) : (
        <div className="grid grid-3">
          {filtered.map((r) => (
            <article key={r.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-blood">{r.bloodType}</span>
                <span className={`badge badge-${r.urgency}`}>{r.urgency}</span>
              </div>
              <h3>
                <Link href={`/requests/${r.id}`}>{r.hospital}</Link>
              </h3>
              <p className="text-muted">
                {r.city} · {r.units} units
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
