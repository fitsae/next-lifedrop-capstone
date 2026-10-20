"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import RequestCard from "@/components/RequestCard";

const BLOOD_TYPES = ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function RequestsClient() {
  const [bloodType, setBloodType] = useState("");
  const [city, setCity] = useState("");

  const params = new URLSearchParams();
  if (bloodType) params.set("bloodType", bloodType);
  if (city) params.set("city", city);
  const key = `/api/requests${params.toString() ? `?${params}` : ""}`;

  const { data, error, isLoading } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  return (
    <>
      <div className="card mb-6">
        <div className="form-row">
          <label htmlFor="bloodType">Blood type</label>
          <select
            id="bloodType"
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
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Addis Ababa"
          />
        </div>
      </div>

      {isLoading && !data && <p>Loading requests…</p>}
      {error && <p className="form-error">Could not load requests.</p>}

      {data && data.data.length === 0 && (
        <p className="text-muted">
          No matching requests. Try widening your search.
        </p>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-3">
          {data.data.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </>
  );
}
