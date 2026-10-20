"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function RecordDonationForm({ hospitalId }) {
  const donors = useStore((s) => s.donors);
  const requests = useStore((s) => s.requests);
  const recordDonation = useStore((s) => s.recordDonation);

  const ownOpenRequests = requests.filter(
    (r) => r.hospitalId === hospitalId && r.status === "open",
  );

  const [donorId, setDonorId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [message, setMessage] = useState("");

  function submit(e) {
    e.preventDefault();
    setMessage("");
    if (!donorId || !requestId) {
      setMessage("Select both a donor and a request.");
      return;
    }
    recordDonation(donorId, requestId);
    setDonorId("");
    setRequestId("");
    setMessage("Donation recorded. The leaderboard has been updated.");
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row">
        <label>Donor</label>
        <select value={donorId} onChange={(e) => setDonorId(e.target.value)}>
          <option value="">Select a donor…</option>
          {donors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.bloodType} ({d.city})
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Request</label>
        <select
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        >
          <option value="">Select a request…</option>
          {ownOpenRequests.map((r) => (
            <option key={r.id} value={r.id}>
              {r.bloodType} — {r.units} unit(s) — {r.city}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Record donation
      </button>

      {message && <p className="form-success">{message}</p>}
    </form>
  );
}
