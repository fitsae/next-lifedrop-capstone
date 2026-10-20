"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthNav() {
  const [session, setSession] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setSession(d);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return <span className="auth-nav" />;

  if (!session) {
    return (
      <span className="auth-nav">
        <Link
          href="/donate"
          className="btn btn-outline"
          style={{ padding: "0.35rem 0.75rem" }}
        >
          Register as donor
        </Link>
        <Link
          href="/login"
          className="btn btn-primary"
          style={{ padding: "0.35rem 0.75rem" }}
        >
          Sign in
        </Link>
      </span>
    );
  }

  // Friendly display name
  const greeting =
    session.role === "admin"
      ? "Hello, Admin"
      : `Hello, ${session.name || session.email}`;

  return (
    <span className="auth-nav">
      <span className="greeting">{greeting}</span>

      {session.role === "admin" && (
        <Link
          href="/admin"
          className="btn btn-outline"
          style={{ padding: "0.35rem 0.75rem" }}
        >
          Admin
        </Link>
      )}

      {session.role === "hospital" && (
        <Link
          href="/dashboard"
          className="btn btn-outline"
          style={{ padding: "0.35rem 0.75rem" }}
        >
          Dashboard
        </Link>
      )}

      <form
        action="/api/auth/signout"
        method="post"
        style={{ display: "inline" }}
      >
        <button
          type="submit"
          className="btn btn-outline"
          style={{ padding: "0.35rem 0.75rem" }}
        >
          Sign out
        </button>
      </form>
    </span>
  );
}
