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

  return (
    <span className="auth-nav">
      {session ? (
        <>
          <Link
            href="/dashboard"
            className="btn btn-outline"
            style={{ padding: "0.35rem 0.75rem" }}
          >
            Dashboard
          </Link>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="btn btn-outline"
              style={{ padding: "0.35rem 0.75rem" }}
            >
              Sign out
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/login"
          className="btn btn-primary"
          style={{ padding: "0.35rem 0.75rem" }}
        >
          Sign in
        </Link>
      )}
    </span>
  );
}
