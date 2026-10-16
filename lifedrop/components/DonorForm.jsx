"use client";

import { useActionState } from "react";
import { registerDonor } from "@/app/actions";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const initial = { success: false, errors: {}, values: {} };

export default function DonorForm() {
  const [state, action, pending] = useActionState(registerDonor, initial);

  return (
    <form action={action} className="card">
      <div className="form-row">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" defaultValue={state.values?.name || ""} />
        {state.errors?.name && (
          <p className="form-error">{state.errors.name}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="bloodType">Blood type</label>
        <select
          id="bloodType"
          name="bloodType"
          defaultValue={state.values?.bloodType || ""}
        >
          <option value="">Select…</option>
          {BLOOD_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {state.errors?.bloodType && (
          <p className="form-error">{state.errors.bloodType}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="city">City</label>
        <input id="city" name="city" defaultValue={state.values?.city || ""} />
        {state.errors?.city && (
          <p className="form-error">{state.errors.city}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          name="phone"
          placeholder="09XXXXXXXX"
          defaultValue={state.values?.phone || ""}
        />
        {state.errors?.phone && (
          <p className="form-error">{state.errors.phone}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="lastDonation">Last donation date (optional)</label>
        <input id="lastDonation" name="lastDonation" type="date" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Registering…" : "Register as donor"}
      </button>

      {state.success && <p className="form-success">{state.message}</p>}
    </form>
  );
}
