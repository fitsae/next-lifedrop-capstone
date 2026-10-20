"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function LeaderboardPage() {
  const hydrated = useHydrated();
  const donations = useStore((s) => s.donations);
  const donors = useStore((s) => s.donors);

  const leaderboard = useMemo(() => {
    const counts = {};
    for (const d of donations) {
      if (!counts[d.donorId])
        counts[d.donorId] = { count: 0, first: d.donatedAt };
      counts[d.donorId].count += 1;
      if (d.donatedAt < counts[d.donorId].first)
        counts[d.donorId].first = d.donatedAt;
    }
    return Object.entries(counts)
      .map(([donorId, { count, first }]) => ({
        donorId,
        count,
        first,
        donor: donors.find((x) => x.id === donorId) || null,
      }))
      .filter((row) => row.donor)
      .sort((a, b) => b.count - a.count || a.first.localeCompare(b.first))
      .slice(0, 10);
  }, [donations, donors]);

  if (!hydrated) return <p>Loading…</p>;

  return (
    <div>
      <h1>Top Donors</h1>
      <p className="text-muted mb-6">
        Ranked by recorded donations. Thank you for saving lives.
      </p>

      {leaderboard.length === 0 ? (
        <p className="text-muted">No donations recorded yet.</p>
      ) : (
        <div className="card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: "0.5rem 0" }}>#</th>
                <th>Donor</th>
                <th>Blood</th>
                <th>City</th>
                <th>Donations</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, i) => (
                <tr
                  key={row.donorId}
                  style={{ borderBottom: "1px solid #f7f0f0" }}
                >
                  <td style={{ padding: "0.5rem 0" }}>{i + 1}</td>
                  <td>
                    <strong>{row.donor.fullName}</strong>
                  </td>
                  <td>
                    <span className="badge badge-blood">
                      {row.donor.bloodType}
                    </span>
                  </td>
                  <td>{row.donor.city}</td>
                  <td>
                    <span className="badge badge-low">
                      {row.count} donation{row.count > 1 ? "s" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
