"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { useSession } from "@/lib/useSession";
import RegisterHospitalForm from "@/components/RegisterHospitalForm";

export default function AdminPage() {
  // ---- 1. All hooks first ----
  const hydrated = useHydrated();
  const session = useSession();

  const hospitals = useStore((s) => s.hospitals);
  const donors = useStore((s) => s.donors);
  const requests = useStore((s) => s.requests);
  const donations = useStore((s) => s.donations);
  const ban = useStore((s) => s.banHospital);
  const unban = useStore((s) => s.unbanHospital);
  const resetPassword = useStore((s) => s.resetHospitalPassword);

  const stats = useMemo(
    () => ({
      donors: donors.length,
      hospitals: hospitals.length,
      bannedHospitals: hospitals.filter((h) => h.status === "banned").length,
      openRequests: requests.filter((r) => r.status === "open").length,
      fulfilledRequests: requests.filter((r) => r.status === "fulfilled")
        .length,
      donations: donations.length,
    }),
    [hospitals, donors, requests, donations],
  );

  // ⬇ new Date() must live in useEffect, not useMemo
  const [donationsPerDay, setDonationsPerDay] = useState([]);

  useEffect(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    const counts = Object.fromEntries(days.map((d) => [d, 0]));
    for (const don of donations) {
      const key = don.donatedAt.slice(0, 10);
      if (key in counts) counts[key] += 1;
    }
    setDonationsPerDay(days.map((d) => ({ date: d, count: counts[d] })));
  }, [donations]);

  const donationsByBloodType = useMemo(() => {
    const counts = {}; // ⬅ the missing line
    for (const don of donations) {
      const donor = donors.find((x) => x.id === don.donorId);
      const t = donor?.bloodType || "?";
      counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [donations, donors]);

  const requestsByCity = useMemo(() => {
    const counts = {};
    for (const r of requests) counts[r.city] = (counts[r.city] || 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [requests]);

  const leaderboard = useMemo(() => {
    const counts = {};
    for (const d of donations) {
      if (!counts[d.donorId])
        counts[d.donorId] = { count: 0, first: d.donatedAt };
      counts[d.donorId].count += 1;
      if (d.donatedAt < counts[d.donorId].first) {
        counts[d.donorId].first = d.donatedAt;
      }
    }
    return Object.entries(counts)
      .map(([donorId, { count, first }]) => ({
        donorId,
        count,
        first,
        donor: donors.find((x) => x.id === donorId) || { fullName: "Unknown" },
      }))
      .sort((a, b) => b.count - a.count || a.first.localeCompare(b.first))
      .slice(0, 10);
  }, [donations, donors]);

  // ---- 2. Guards ----
  if (!hydrated || session === undefined) return <p>Loading…</p>;

  if (!session || session.role !== "admin") {
    return (
      <div className="card">
        <h1>Access denied</h1>
        <p className="text-muted">
          This page is available only to the LifeDrop administrator.
        </p>
      </div>
    );
  }

  // ---- 3. Render ----
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="grid grid-3 mb-6">
        <Stat label="Donors" value={stats.donors} />
        <Stat label="Hospitals" value={stats.hospitals} />
        <Stat label="Banned" value={stats.bannedHospitals} />
        <Stat label="Open requests" value={stats.openRequests} />
        <Stat label="Fulfilled" value={stats.fulfilledRequests} />
        <Stat label="Donations" value={stats.donations} />
      </div>

      <div className="grid grid-2 mb-6">
        <BarChart
          title="Donations — last 7 days"
          data={donationsPerDay.map((d) => ({
            label: d.date.slice(5),
            value: d.count,
          }))}
        />

        <BarChart
          title="Donations by blood type"
          data={donationsByBloodType.map(([label, value]) => ({
            label,
            value,
          }))}
        />
      </div>

      <div className="grid grid-2 mb-6">
        <BarChart
          title="Requests by city (top 5)"
          data={requestsByCity.map(([label, value]) => ({ label, value }))}
        />

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Fulfillment rate</h3>
          {(() => {
            const total = stats.openRequests + stats.fulfilledRequests;
            const rate =
              total === 0
                ? 0
                : Math.round((stats.fulfilledRequests / total) * 100);
            return (
              <>
                <h2 style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>
                  {rate}%
                </h2>
                <p className="text-muted">
                  {stats.fulfilledRequests} of {total} requests fulfilled
                </p>
              </>
            );
          })()}
        </div>
      </div>

      <section className="mb-6">
        <h2>Hospitals</h2>
        <div className="card">
          {hospitals.length === 0 && (
            <p className="text-muted">No hospitals registered yet.</p>
          )}
          {hospitals.map((h) => (
            <div
              key={h.id}
              style={{ padding: "0.9rem 0", borderBottom: "1px solid #f0e0e0" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>{h.name}</strong>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {h.city} · {h.email} · {h.phone}
                  </p>
                  <p style={{ margin: "0.35rem 0 0" }}>
                    <span className="text-muted">Current password: </span>
                    <code style={{ fontSize: "1rem", letterSpacing: "1px" }}>
                      {h.password}
                    </code>
                    {h.mustChangePassword ? (
                      <span
                        className="badge badge-high"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        one-time — not yet changed
                      </span>
                    ) : (
                      <span
                        className="badge badge-low"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        active
                      </span>
                    )}
                  </p>
                </div>

                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <span
                    className={`badge badge-${h.status === "active" ? "low" : "high"}`}
                  >
                    {h.status}
                  </span>

                  <button
                    className="btn btn-outline"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }}
                    onClick={() => resetPassword(h.id)}
                  >
                    Reset password
                  </button>

                  {h.status === "active" ? (
                    <button
                      className="btn btn-outline"
                      style={{
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => ban(h.id)}
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline"
                      style={{
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => unban(h.id)}
                    >
                      Unban
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2>Register a new hospital</h2>
        <RegisterHospitalForm />
      </section>

      <section className="mb-6">
        <h2>All donors (full info)</h2>
        <div className="card">
          {donors.length === 0 && <p className="text-muted">No donors yet.</p>}
          {donors.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{ textAlign: "left", borderBottom: "1px solid #eee" }}
                >
                  <th style={{ padding: "0.5rem 0" }}>Full name</th>
                  <th>Blood</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Consent</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid #f7f0f0" }}>
                    <td style={{ padding: "0.5rem 0" }}>{d.fullName}</td>
                    <td>
                      <span className="badge badge-blood">{d.bloodType}</span>
                    </td>
                    <td>{d.city}</td>
                    <td>{d.phone}</td>
                    <td className="text-muted">{d.address || "—"}</td>
                    <td>
                      {d.contactConsent ? (
                        <span className="badge badge-low">Yes</span>
                      ) : (
                        <span className="badge badge-high">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mb-6">
        <h2>Donations log</h2>
        <div className="card">
          {donations.length === 0 ? (
            <p className="text-muted">No donations recorded.</p>
          ) : (
            donations.map((d) => {
              const donor = donors.find((x) => x.id === d.donorId);
              const hospital = hospitals.find((x) => x.id === d.hospitalId);
              return (
                <p
                  key={d.id}
                  className="text-muted"
                  style={{ margin: "0.25rem 0" }}
                >
                  <strong>{donor?.fullName ?? "Unknown"}</strong> donated at{" "}
                  <strong>{hospital?.name ?? "Unknown"}</strong> on{" "}
                  {new Date(d.donatedAt).toLocaleDateString()}
                </p>
              );
            })
          )}
        </div>
      </section>

      <section>
        <h2>Top donors</h2>
        <div className="card">
          {leaderboard.length === 0 && (
            <p className="text-muted">No donations yet.</p>
          )}
          {leaderboard.map((row, i) => (
            <p key={row.donorId} style={{ margin: "0.35rem 0" }}>
              {i + 1}. <strong>{row.donor.fullName}</strong> — {row.count}{" "}
              donation
              {row.count > 1 ? "s" : ""}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function Stat({ label, value }) {
  return (
    <div className="card">
      <p className="text-muted" style={{ margin: 0 }}>
        {label}
      </p>
      <h2 style={{ fontSize: "2rem", margin: "0.25rem 0 0" }}>{value}</h2>
    </div>
  );
}

function BarChart({ title, data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {data.length === 0 ? (
        <p className="text-muted">No data yet.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            marginTop: "0.5rem",
          }}
        >
          {data.map((d) => (
            <div
              key={d.label}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr 30px",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                {d.label}
              </span>
              <div
                style={{
                  background: "#f0e0e0",
                  borderRadius: 4,
                  height: 14,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(d.value / max) * 100}%`,
                    background: "#d32f2f",
                    height: "100%",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.85rem", textAlign: "right" }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
