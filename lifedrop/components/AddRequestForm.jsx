"use client";

import { useActionState } from "react";
import { createRequest } from "@/app/actions";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const initial = { success: false, errors: {} };

export default function AddRequestForm() {
  const [state, action, pending] = useActionState(createRequest, initial);

  return (
    <form action={action} className="card">
      <div className="form-row">
        <label htmlFor="bloodType">Blood type</label>
        <select id="bloodType" name="bloodType">
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
        <input id="city" name="city" placeholder="Addis Ababa" />
        {state.errors?.city && (
          <p className="form-error">{state.errors.city}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="hospital">Hospital</label>
        <input id="hospital" name="hospital" />
        {state.errors?.hospital && (
          <p className="form-error">{state.errors.hospital}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="units">Units needed</label>
        <input id="units" name="units" type="number" min="1" defaultValue={1} />
        {state.errors?.units && (
          <p className="form-error">{state.errors.units}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="urgency">Urgency</label>
        <select id="urgency" name="urgency" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" rows={3} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Posting…" : "Post request"}
      </button>
    </form>
  );
}
