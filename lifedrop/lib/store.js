"use client";

import { create } from "zustand";

const STORAGE_KEY = "lifedrop-store-v5";

const SEED = {
  hospitals: [
    {
      id: "hosp-1",
      name: "Black Lion Hospital",
      city: "Addis Ababa",
      email: "blacklion@lifedrop.et",
      phone: "0911111111",
      password: "lifedrop123",
      mustChangePassword: false,
      status: "active",
      registeredAt: "2026-09-01T08:00:00Z",
    },
    {
      id: "hosp-2",
      name: "St. Paul Hospital",
      city: "Addis Ababa",
      email: "stpaul@lifedrop.et",
      phone: "0912222222",
      password: "lifedrop123",
      mustChangePassword: false,
      status: "active",
      registeredAt: "2026-09-05T08:00:00Z",
    },
    {
      id: "hosp-3",
      name: "Ayder Referral Hospital",
      city: "Mekelle",
      email: "ayder@lifedrop.et",
      phone: "0913333333",
      password: "lifedrop123",
      mustChangePassword: false,
      status: "active",
      registeredAt: "2026-09-08T08:00:00Z",
    },
    {
      id: "hosp-4",
      name: "Hawassa Referral Hospital",
      city: "Hawassa",
      email: "hawassa@lifedrop.et",
      phone: "0914444444",
      password: "lifedrop123",
      mustChangePassword: false,
      status: "active",
      registeredAt: "2026-09-10T08:00:00Z",
    },
    {
      id: "hosp-5",
      name: "Adama Referral Hospital",
      city: "Adama",
      email: "adama@lifedrop.et",
      phone: "0915555555",
      password: "lifedrop123",
      mustChangePassword: false,
      status: "active",
      registeredAt: "2026-09-12T08:00:00Z",
    },
    {
      id: "hosp-6",
      name: "Gondar Referral Hospital",
      city: "Gondar",
      email: "gondar@lifedrop.et",
      phone: "0916666666",
      password: "lifedrop123",
      mustChangePassword: false,
      status: "active",
      registeredAt: "2026-09-15T08:00:00Z",
    },
  ],
  donors: [
    {
      id: "donor-1",
      fullName: "Sara Lemma",
      publicName: "Sara L.",
      bloodType: "O+",
      city: "Addis Ababa",
      phone: "0917777777",
      address: "Bole, near Edna Mall",
      testedAt: "2026-09-10T08:00:00Z",
      registeredBy: "hosp-1",
      contactConsent: true,
      registeredAt: "2026-09-10T08:00:00Z",
      verified: true,
    },
    {
      id: "donor-2",
      fullName: "Hanna Wolde",
      publicName: "Hanna W.",
      bloodType: "A+",
      city: "Addis Ababa",
      phone: "0918888888",
      address: "Kirkos",
      testedAt: "2026-09-12T08:00:00Z",
      registeredBy: "hosp-1",
      contactConsent: false,
      registeredAt: "2026-09-12T08:00:00Z",
      verified: true,
    },
    {
      id: "donor-3",
      fullName: "Dawit Mekonnen",
      publicName: "Dawit M.",
      bloodType: "O-",
      city: "Adama",
      phone: "0919999999",
      address: "Adama, Franco",
      testedAt: "2026-09-15T08:00:00Z",
      registeredBy: "hosp-5",
      contactConsent: true,
      registeredAt: "2026-09-15T08:00:00Z",
      verified: true,
    },
  ],
  requests: [
    {
      id: "req-1",
      hospitalId: "hosp-1",
      bloodType: "O+",
      city: "Addis Ababa",
      hospital: "Black Lion Hospital",
      units: 2,
      urgency: "high",
      notes: "Surgery tomorrow morning",
      createdAt: "2026-10-01T08:00:00Z",
      status: "open",
      fulfilledAt: null,
    },
    {
      id: "req-2",
      hospitalId: "hosp-2",
      bloodType: "A+",
      city: "Addis Ababa",
      hospital: "St. Paul Hospital",
      units: 1,
      urgency: "medium",
      notes: "",
      createdAt: "2026-10-03T10:00:00Z",
      status: "open",
      fulfilledAt: null,
    },
    {
      id: "req-3",
      hospitalId: "hosp-1",
      bloodType: "O-",
      city: "Addis Ababa",
      hospital: "Black Lion Hospital",
      units: 3,
      urgency: "high",
      notes: "Accident case",
      createdAt: "2026-10-04T14:30:00Z",
      status: "open",
      fulfilledAt: null,
    },
  ],
  donations: [
    {
      id: "don-1",
      donorId: "donor-1",
      hospitalId: "hosp-1",
      requestId: "req-1",
      donatedAt: "2026-10-02T10:00:00Z",
    },
    {
      id: "don-2",
      donorId: "donor-1",
      hospitalId: "hosp-2",
      requestId: "req-2",
      donatedAt: "2026-09-28T10:00:00Z",
    },
    {
      id: "don-3",
      donorId: "donor-2",
      hospitalId: "hosp-1",
      requestId: "req-1",
      donatedAt: "2026-10-02T11:00:00Z",
    },
  ],
};

function generateOtp() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export const useStore = create((set, get) => ({
  ...SEED,

  registerHospital: (data) => {
    const email = normalizeEmail(data.email);
    if (!email) return { ok: false, reason: "invalid-email" };

    const existing = get().hospitals.find(
      (h) => normalizeEmail(h.email) === email,
    );
    if (existing) return { ok: false, reason: "duplicate" };

    const newHospital = {
      id: `hosp-${Date.now()}`,
      name: data.name.trim(),
      city: data.city.trim(),
      email,
      phone: data.phone.trim(),
      password: data.otp,
      mustChangePassword: true,
      status: "active",
      registeredAt: new Date().toISOString(),
    };

    set({ hospitals: [...get().hospitals, newHospital] });
    return { ok: true, hospital: newHospital };
  },

  banHospital: (id) =>
    set({
      hospitals: get().hospitals.map((h) =>
        h.id === id ? { ...h, status: "banned" } : h,
      ),
    }),

  unbanHospital: (id) =>
    set({
      hospitals: get().hospitals.map((h) =>
        h.id === id ? { ...h, status: "active" } : h,
      ),
    }),

  resetHospitalPassword: (id) =>
    set({
      hospitals: get().hospitals.map((h) =>
        h.id === id
          ? { ...h, password: generateOtp(), mustChangePassword: true }
          : h,
      ),
    }),

  changeHospitalPassword: (email, newPassword) => {
    const norm = normalizeEmail(email);
    set({
      hospitals: get().hospitals.map((h) =>
        normalizeEmail(h.email) === norm
          ? { ...h, password: newPassword, mustChangePassword: false }
          : h,
      ),
    });
  },

  verifyHospitalLogin: (email, password) => {
    const norm = normalizeEmail(email);
    const h = get().hospitals.find((x) => normalizeEmail(x.email) === norm);
    if (!h) return { ok: false, reason: "not-found" };
    if (h.status === "banned") return { ok: false, reason: "banned" };
    if (h.password !== password) return { ok: false, reason: "wrong-password" };
    return { ok: true, hospital: h };
  },

  findHospitalByEmail: (email) => {
    const norm = normalizeEmail(email);
    return get().hospitals.find((h) => normalizeEmail(h.email) === norm);
  },

  createRequest: (hospitalId, data) => {
    const hospital = get().hospitals.find((h) => h.id === hospitalId);
    if (!hospital || hospital.status !== "active") return;
    set({
      requests: [
        {
          id: `req-${Date.now()}`,
          hospitalId,
          hospital: hospital.name,
          ...data,
          createdAt: new Date().toISOString(),
          status: "open",
          fulfilledAt: null,
        },
        ...get().requests,
      ],
    });
  },

  fulfillRequest: (requestId) =>
    set({
      requests: get().requests.map((r) =>
        r.id === requestId
          ? { ...r, status: "fulfilled", fulfilledAt: new Date().toISOString() }
          : r,
      ),
    }),

  registerDonor: (data) =>
    set({
      donors: [
        ...get().donors,
        {
          id: `donor-${Date.now()}`,
          fullName: data.name,
          publicName: toPublicName(data.name),
          bloodType: data.bloodType,
          city: data.city,
          phone: data.phone,
          address: data.address || "",
          testedAt: null,
          registeredBy: null,
          contactConsent: false,
          registeredAt: new Date().toISOString(),
          verified: false,
        },
      ],
    }),

  registerVerifiedDonor: (hospitalId, data) =>
    set({
      donors: [
        ...get().donors,
        {
          id: `donor-${Date.now()}`,
          fullName: data.fullName,
          publicName: data.publicName || toPublicName(data.fullName),
          bloodType: data.bloodType,
          city: data.city,
          phone: data.phone,
          address: data.address || "",
          testedAt: new Date().toISOString(),
          registeredBy: hospitalId,
          contactConsent: data.contactConsent,
          registeredAt: new Date().toISOString(),
          verified: true,
        },
      ],
    }),

  recordDonation: (donorId, requestId) => {
    const request = get().requests.find((r) => r.id === requestId);
    if (!request) return;
    set({
      donations: [
        ...get().donations,
        {
          id: `don-${Date.now()}`,
          donorId,
          requestId,
          hospitalId: request.hospitalId,
          donatedAt: new Date().toISOString(),
        },
      ],
    });
  },

  resetStore: () => set({ ...SEED }),
}));

function toPublicName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

/* ---------------- localStorage helpers (client-only) ---------------- */

export function loadFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      console.log("[store] no stored data, using seed");
      return;
    }
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !Array.isArray(parsed.hospitals) ||
      !Array.isArray(parsed.donors) ||
      !Array.isArray(parsed.requests) ||
      !Array.isArray(parsed.donations)
    ) {
      console.warn("[store] invalid stored shape, using seed");
      return;
    }
    useStore.setState(parsed);
    console.log("[store] loaded from localStorage:", {
      hospitals: parsed.hospitals.length,
      donors: parsed.donors.length,
      requests: parsed.requests.length,
      donations: parsed.donations.length,
    });
  } catch (err) {
    console.error("[store] failed to load:", err);
  }
}

export function saveToStorage(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hospitals: state.hospitals,
        donors: state.donors,
        requests: state.requests,
        donations: state.donations,
      }),
    );
  } catch (err) {
    console.error("[store] failed to save:", err);
  }
}

export const selectHospitals = (s) => s.hospitals;
export const selectDonors = (s) => s.donors;
export const selectRequests = (s) => s.requests;
export const selectDonations = (s) => s.donations;
