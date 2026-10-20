"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function DonorForm() {
  const registerDonor = useStore((s) => s.registerDonor);

  const [values, setValues] = useState({
    name: "",
    bloodType: "",
    city: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!values.name.trim() || values.name.trim().length < 2)
      errs.name = "Enter your full name.";
    if (!values.bloodType) errs.bloodType = "Select a blood type.";
    if (!values.city.trim()) errs.city = "Enter your city.";
    if (!/^(?:\+251|0)9\d{8}$/.test(values.phone))
      errs.phone = "Enter a valid Ethiopian phone number (09XXXXXXXX).";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSuccess(false);
      return;
    }

    registerDonor({
      name: values.name.trim(),
      bloodType: values.bloodType,
      city: values.city.trim(),
      phone: values.phone,
    });

    setValues({ name: "", bloodType: "", city: "", phone: "" });
    setErrors({});
    setSuccess(true);
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="bloodType">Blood type</label>
        <select
          id="bloodType"
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
        <label htmlFor="city">City</label>
        <input
          id="city"
          value={values.city}
          onChange={(e) => set("city", e.target.value)}
        />
        {errors.city && <p className="form-error">{errors.city}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          placeholder="09XXXXXXXX"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </div>

      <button className="btn btn-primary" type="submit">
        Register as donor
      </button>

      {success && (
        <p className="form-success">
          Thank you. You are now on the donor list.
        </p>
      )}
    </form>
  );
}
