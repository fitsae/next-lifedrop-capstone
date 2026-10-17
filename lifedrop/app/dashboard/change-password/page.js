"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useSession } from "@/lib/useSession";

export default function ChangePasswordPage() {
  const session = useSession();
  const changePassword = useStore((s) => s.changeHospitalPassword);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  if (session === undefined) return <p>Loading…</p>;
  if (!session || session.role !== "hospital") {
    return <p className="text-muted">Sign in as a hospital first.</p>;
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (pw1.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setError("Passwords do not match.");
      return;
    }

    changePassword(session.email, pw1);

    // Hard reload — ensures new session cookie is read fresh.
    window.location.href = "/dashboard";
  }

  return (
    <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
      <h1>Change your password</h1>
      <p className="text-muted">
        You signed in with a one-time password. Please choose a new password.
      </p>

      <form onSubmit={submit}>
        <div className="form-row">
          <label>New password</label>
          <input
            type="password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="form-row">
          <label>Confirm new password</label>
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" type="submit">
          Save new password
        </button>
      </form>
    </div>
  );
}
