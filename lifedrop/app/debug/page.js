"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function DebugPage() {
  const hydrated = useHydrated();
  const hospitals = useStore((s) => s.hospitals);
  const [session, setSession] = useState("fetching…");
  const [cookieHeader, setCookieHeader] = useState("fetching…");
  const [rawStore, setRawStore] = useState("");

  useEffect(() => {
    fetch("/api/me").then(async (r) => {
      const body = await r.text();
      setSession(`status ${r.status} — ${body}`);
    });

    fetch("/api/debug-cookie").then(async (r) => {
      const body = await r.text();
      setCookieHeader(body);
    });

    setRawStore(localStorage.getItem("lifedrop-store") || "(empty)");
  }, []);

  return (
    <div className="card">
      <h1>Debug</h1>

      <h2>hydration</h2>
      <pre style={{ background: "#f5f5f5", padding: "0.75rem" }}>
        hydrated = {String(hydrated)}
      </pre>

      <h2>/api/me</h2>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "0.75rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {session}
      </pre>

      <h2>/api/debug-cookie (raw cookie header)</h2>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "0.75rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {cookieHeader}
      </pre>

      <h2>Hospitals in store ({hospitals.length})</h2>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "0.75rem",
          fontSize: "0.85rem",
          overflow: "auto",
        }}
      >
        {JSON.stringify(
          hospitals.map((h) => ({
            id: h.id,
            email: h.email,
            password: h.password,
            mustChangePassword: h.mustChangePassword,
            status: h.status,
          })),
          null,
          2,
        )}
      </pre>

      <h2>localStorage snapshot</h2>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "0.75rem",
          fontSize: "0.8rem",
          whiteSpace: "pre-wrap",
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {rawStore}
      </pre>
    </div>
  );
}
