"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const hydrated = useHydrated();
  const verify = useStore((s) => s.verifyHospitalLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!hydrated) {
      setError("Still loading. Try again in a moment.");
      return;
    }

    if (normalizedEmail === "admin@lifedrop.et") {
      if (password !== "lifedrop123") {
        setError("Incorrect admin password.");
        return;
      }
      postAndRedirect(normalizedEmail, password, "/admin");
      return;
    }

    const result = verify(normalizedEmail, password);

    if (!result.ok) {
      if (result.reason === "not-found")
        setError("No hospital registered with that email.");
      else if (result.reason === "banned")
        setError("This hospital has been banned.");
      else setError("Incorrect password.");
      return;
    }

    const target = result.hospital.mustChangePassword
      ? "/dashboard/change-password"
      : next;

    postAndRedirect(normalizedEmail, password, target);
  }

  function postAndRedirect(email, password, target) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/signin";
    for (const [k, v] of Object.entries({ email, password, next: target })) {
      const input = document.createElement("input");
      input.name = k;
      input.value = v;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
      </div>

      <div className="form-row">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={!hydrated}>
        {hydrated ? "Sign in" : "Loading…"}
      </button>

      <div className="mt-4" style={{ fontSize: "0.85rem" }}>
        <p className="text-muted" style={{ margin: "0.25rem 0" }}>
          <strong>Admin:</strong> <code>admin@lifedrop.et</code> /{" "}
          <code>lifedrop123</code>
        </p>
        <p className="text-muted" style={{ margin: "0.25rem 0" }}>
          <strong>Demo hospital:</strong> <code>blacklion@lifedrop.et</code> /{" "}
          <code>lifedrop123</code>
        </p>
        <p className="text-muted" style={{ margin: "0.25rem 0" }}>
          Hospitals registered by the admin sign in with the one-time password
          and are asked to change it immediately.
        </p>
      </div>
    </form>
  );
}
