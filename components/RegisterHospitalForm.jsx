"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

function generateOtp() {
  // 8 chars, easy to read aloud
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function RegisterHospitalForm() {
  const hydrated = useHydrated();
  const register = useStore((s) => s.registerHospital);
  const [values, setValues] = useState({
    name: "",
    city: "",
    email: "",
    phone: "",
    otp: generateOtp(),
  });
  const [errors, setErrors] = useState({});
  const [lastCreated, setLastCreated] = useState(null);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    setErrors({});
    setLastCreated(null);

    const errs = {};
    if (!values.name.trim()) errs.name = "Required.";
    if (!values.city.trim()) errs.city = "Required.";
    if (!values.email.includes("@")) errs.email = "Invalid email.";
    if (!/^(?:\+251|0)9\d{8}$/.test(values.phone))
      errs.phone = "Invalid Ethiopian phone.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    console.log("[form] values:", values);
    const result = register(values);
    console.log("[form] register result:", result);

    if (!result?.ok) {
      if (result?.reason === "duplicate") {
        setErrors({ email: "Email already registered." });
      } else {
        setErrors({ email: "Registration failed." });
      }
      return;
    }

    setLastCreated({ ...values, email: values.email.trim().toLowerCase() });
    setValues({
      name: "",
      city: "",
      email: "",
      phone: "",
      otp: generateOtp(),
    });
  }

  return (
    <>
      <form onSubmit={submit} className="card">
        <div className="form-row">
          <label>Hospital name</label>
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-row">
          <label>City</label>
          <input
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
          />
          {errors.city && <p className="form-error">{errors.city}</p>}
        </div>

        <div className="form-row">
          <label>Email</label>
          <input
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-row">
          <label>Phone</label>
          <input
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        <div className="form-row">
          <label>One-time password (OTP)</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={values.otp}
              onChange={(e) => set("otp", e.target.value.toUpperCase())}
              style={{ flex: 1, fontFamily: "monospace", letterSpacing: "2px" }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => set("otp", generateOtp())}
            >
              Regenerate
            </button>
          </div>
          <p
            className="text-muted"
            style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}
          >
            Give this to the hospital. They will be forced to change it on first
            sign-in.
          </p>
        </div>

        <button className="btn btn-primary" type="submit" disabled={!hydrated}>
          {hydrated ? "Register hospital" : "Loading…"}
        </button>
      </form>

      {lastCreated && (
        <div
          className="card"
          style={{ background: "#ffecec", borderColor: "#d32f2f" }}
        >
          <h3>Hospital registered</h3>
          <p style={{ margin: "0.35rem 0" }}>
            <strong>{lastCreated.name}</strong> — {lastCreated.city}
          </p>
          <p style={{ margin: "0.35rem 0" }}>
            Email: <code>{lastCreated.email}</code>
          </p>
          <p style={{ margin: "0.35rem 0" }}>
            OTP:{" "}
            <code style={{ fontSize: "1.1rem", letterSpacing: "2px" }}>
              {lastCreated.otp}
            </code>
          </p>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>
            Copy this OTP now. It cannot be retrieved later.
          </p>
        </div>
      )}
    </>
  );
}
