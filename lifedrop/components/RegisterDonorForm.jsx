"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function RegisterDonorForm({ hospitalId }) {
  const registerVerified = useStore((s) => s.registerVerifiedDonor);

  const [values, setValues] = useState({
    fullName: "",
    publicName: "",
    bloodType: "",
    city: "",
    phone: "",
    address: "",
    contactConsent: null, // true | false | null
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function suggestPublicName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length < 2) return fullName;
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  }

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!values.fullName.trim() || values.fullName.trim().length < 2)
      errs.fullName = "Required.";
    if (!values.bloodType) errs.bloodType = "Required.";
    if (!values.city.trim()) errs.city = "Required.";
    if (!/^(?:\+251|0)9\d{8}$/.test(values.phone))
      errs.phone = "Invalid Ethiopian phone.";
    if (values.contactConsent === null)
      errs.contactConsent = "Ask the donor and record their answer.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSuccess(false);
      return;
    }

    registerVerified(hospitalId, {
      fullName: values.fullName.trim(),
      publicName:
        values.publicName.trim() || suggestPublicName(values.fullName),
      bloodType: values.bloodType,
      city: values.city.trim(),
      phone: values.phone,
      address: values.address.trim(),
      contactConsent: values.contactConsent,
    });

    setValues({
      fullName: "",
      publicName: "",
      bloodType: "",
      city: "",
      phone: "",
      address: "",
      contactConsent: null,
    });
    setErrors({});
    setSuccess(true);
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row">
        <label>Full name (private)</label>
        <input
          value={values.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          onBlur={(e) => {
            if (!values.publicName && e.target.value.length > 2) {
              set("publicName", suggestPublicName(e.target.value));
            }
          }}
        />
        {errors.fullName && <p className="form-error">{errors.fullName}</p>}
      </div>

      <div className="form-row">
        <label>Public name (shown on leaderboard)</label>
        <input
          value={values.publicName}
          onChange={(e) => set("publicName", e.target.value)}
          placeholder="e.g. Sara L."
        />
      </div>

      <div className="form-row">
        <label>Blood type</label>
        <select
          value={values.bloodType}
          onChange={(e) => set("bloodType", e.target.value)}
        >
          <option value="">Select…</option>
          {BLOOD_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {errors.bloodType && <p className="form-error">{errors.bloodType}</p>}
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
        <label>Phone</label>
        <input
          value={values.phone}
          placeholder="09XXXXXXXX"
          onChange={(e) => set("phone", e.target.value)}
        />
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </div>

      <div className="form-row">
        <label>Address / subcity (optional)</label>
        <input
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Contact consent — ask the donor now</label>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <input
              type="radio"
              name="consent"
              checked={values.contactConsent === true}
              onChange={() => set("contactConsent", true)}
            />
            Yes, can be contacted again
          </label>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <input
              type="radio"
              name="consent"
              checked={values.contactConsent === false}
              onChange={() => set("contactConsent", false)}
            />
            No
          </label>
        </div>
        {errors.contactConsent && (
          <p className="form-error">{errors.contactConsent}</p>
        )}
      </div>

      <button className="btn btn-primary" type="submit">
        Register verified donor
      </button>

      {success && (
        <p className="form-success">
          Donor registered. They will appear on the leaderboard after their
          donation is recorded.
        </p>
      )}
    </form>
  );
}
