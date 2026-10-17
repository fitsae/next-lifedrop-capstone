"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function AddRequestForm({ hospitalId }) {
  const create = useStore((s) => s.createRequest);

  const [values, setValues] = useState({
    bloodType: "",
    city: "",
    units: 1,
    urgency: "medium",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setValues((x) => ({ ...x, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!values.bloodType) errs.bloodType = "Required.";
    if (!values.city.trim()) errs.city = "Required.";
    if (!values.units || values.units < 1) errs.units = "Must be ≥ 1.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    create(hospitalId, {
      bloodType: values.bloodType,
      city: values.city.trim(),
      units: Number(values.units),
      urgency: values.urgency,
      notes: values.notes.trim(),
    });

    setValues({
      bloodType: "",
      city: "",
      units: 1,
      urgency: "medium",
      notes: "",
    });
    setErrors({});
  }

  return (
    <form onSubmit={submit} className="card">
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
        <label>Units needed</label>
        <input
          type="number"
          min="1"
          value={values.units}
          onChange={(e) => set("units", e.target.value)}
        />
        {errors.units && <p className="form-error">{errors.units}</p>}
      </div>
      <div className="form-row">
        <label>Urgency</label>
        <select
          value={values.urgency}
          onChange={(e) => set("urgency", e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="form-row">
        <label>Notes (optional)</label>
        <textarea
          rows={3}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
      <button className="btn btn-primary" type="submit">
        Post request
      </button>
    </form>
  );
}
