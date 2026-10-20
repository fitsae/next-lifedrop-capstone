"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { useSession } from "@/lib/useSession";
import AddRequestForm from "@/components/AddRequestForm";
import RecordDonationForm from "@/components/RecordDonationForm";
import RegisterDonorForm from "@/components/RegisterDonorForm";

export default function HospitalDashboard() {
  const hydrated = useHydrated();
  const session = useSession();
  const findHospital = useStore((s) => s.findHospitalByEmail);
  const hospitals = useStore((s) => s.hospitals);
  const requests = useStore((s) => s.requests);
  const donations = useStore((s) => s.donations);
  const donors = useStore((s) => s.donors);
  const fulfill = useStore((s) => s.fulfillRequest);

  const [tab, setTab] = useState("requests");

  // Loading
  if (!hydrated || session === undefined) {
    return <p>Loading…</p>;
  }

  // Not signed in
  if (!session || session.role !== "hospital") {
    return (
      <div className="card">
        <h1>Sign in required</h1>
        <p className="text-muted">
          <Link href="/login?next=/dashboard">Sign in as a hospital</Link> to
          access the dashboard.
        </p>
      </div>
    );
  }

  // Look up the hospital record.
  const hospital = findHospital(session.email);

  console.log("[dashboard] lookup", {
    sessionEmail: session.email,
    hospitalCount: hospitals.length,
    hospitalEmails: hospitals.map((h) => h.email),
    matched: hospital?.name ?? "NOT FOUND",
  });

  if (!hospital) {
    return (
      <div className="card">
        <h1>Hospital record not found</h1>
        <p className="text-muted">
          Signed in as <code>{session.email}</code>, but no matching hospital in
          the store.
        </p>
        <p className="text-muted">
          Ask the administrator to register this hospital. Total hospitals:{" "}
          {hospitals.length}.
        </p>
        <Link href="/login" className="btn btn-outline">
          Sign out and retry
        </Link>
      </div>
    );
  }

  if (hospital.status === "banned") {
    return (
      <div className="card">
        <h1>Account suspended</h1>
        <p className="text-muted">
          Your hospital has been banned. Contact the administrator.
        </p>
      </div>
    );
  }

  const ownRequests = requests.filter((r) => r.hospitalId === hospital.id);
  const ownDonations = donations.filter((d) => d.hospitalId === hospital.id);
  const ownDonors = donors.filter((d) => d.registeredBy === hospital.id);

  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <p className="text-muted">Signed in as {hospital.name}.</p>

      <div
        className="mb-4"
        style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
      >
        {[
          ["requests", "Requests"],
          ["post", "Post new"],
          ["donations", "Record donation"],
          ["donors", "Donor registry"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? "btn btn-primary" : "btn btn-outline"}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <section>
          <h2>Your requests</h2>
          {ownRequests.length === 0 ? (
            <p className="text-muted">No requests yet.</p>
          ) : (
            ownRequests.map((r) => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-blood">{r.bloodType}</span>
                  <span className={`badge badge-${r.urgency}`}>
                    {r.urgency}
                  </span>
                </div>
                <p className="text-muted">
                  {r.units} units · {r.city} · status:{" "}
                  <strong>{r.status}</strong>
                </p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/requests/${r.id}`} className="btn btn-outline">
                    View public page
                  </Link>
                  {r.status === "open" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => fulfill(r.id)}
                    >
                      Mark as fulfilled
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "post" && (
        <section>
          <h2>Post a new request</h2>
          <AddRequestForm hospitalId={hospital.id} />
        </section>
      )}

      {tab === "donations" && (
        <section>
          <h2>Record a donation</h2>
          <RecordDonationForm hospitalId={hospital.id} />
          <h2 className="mt-6">Donations recorded</h2>
          {ownDonations.length === 0 ? (
            <p className="text-muted">No donations yet.</p>
          ) : (
            <div className="card">
              {ownDonations.map((d) => {
                const donor = donors.find((x) => x.id === d.donorId);
                return (
                  <p
                    key={d.id}
                    className="text-muted"
                    style={{ margin: "0.35rem 0" }}
                  >
                    <strong>{donor?.fullName ?? "Unknown"}</strong> —{" "}
                    {new Date(d.donatedAt).toLocaleDateString()}
                  </p>
                );
              })}
            </div>
          )}
        </section>
      )}

      {tab === "donors" && (
        <section>
          <h2>Register a donor after 1st donation</h2>
          <RegisterDonorForm hospitalId={hospital.id} />
          <h2 className="mt-6">Donors registered by {hospital.name}</h2>
          {ownDonors.length === 0 ? (
            <p className="text-muted">No donors yet.</p>
          ) : (
            <div className="card">
              {ownDonors.map((d) => (
                <p
                  key={d.id}
                  className="text-muted"
                  style={{ margin: "0.35rem 0" }}
                >
                  <strong>{d.fullName}</strong> · {d.bloodType} · {d.city}
                </p>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
