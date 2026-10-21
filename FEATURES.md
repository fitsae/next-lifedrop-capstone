# LifeDrop — Feature Inventory

A complete list of what LifeDrop does, organised by user role and by
system capability. Use this document as the single source of truth
when verifying a build, preparing a demo, or onboarding a developer.

---

## User roles

| Role         | How they get access                            | Can they create other users? |
| ------------ | ---------------------------------------------- | ---------------------------- |
| **Guest**    | Anonymous — no login                           | No                           |
| **Donor**    | Self-registers on `/donate`                    | No                           |
| **Hospital** | Registered by admin only — no self-signup      | No                           |
| **Admin**    | Single hardcoded account (`admin@lifedrop.et`) | Yes — creates hospitals      |

---

## Guest features (no sign-in required)

### Browse blood requests

- **Route:** `/requests`
- **What:** Card grid of all open requests, one card per hospital post.
- **Filters:** blood type (dropdown), city (free text).
- **Behaviour:** filters applied client-side with `useMemo`. No server round-trip.
- **Data:** pulled from `useStore().requests`, filtered by `status === "open"`.

### View a single request

- **Route:** `/requests/[id]`
- **What:** Full detail — blood type, urgency, units needed, hospital, city, notes.
- **Contact:** hospital phone rendered as a `tel:` link. Tapping it dials on mobile.
- **Empty state:** "Request not found" card with a back link.

### Leaderboard

- **Route:** `/leaderboard`
- **What:** Top 10 donors ranked by total recorded donations.
- **Tiebreak:** earliest first-donation date (earlier wins).
- **Visibility:** full name, blood type, city, donation count.
- **Hidden:** phone, address, consent status — those are admin/hospital only.

### Self-register as a donor

- **Route:** `/donate`
- **Fields:** name, blood type, city, phone (Ethiopian format validated).
- **Result:** donor appears on `/leaderboard` once a hospital records a donation.
- **Not verified yet:** this is a self-signup; hospitals must verify with a blood test.

### About page

- **Route:** `/about`
- **Content:** how LifeDrop works, privacy note, mock-data disclaimer.

### Home page

- **Route:** `/`
- **Content:** hero, three urgent requests pulled live, three-step explainer.

---

## Donor features (post-registration)

Donors do **not** sign in. Their data is stored in the shared store and
surfaced wherever it matters.

- Appear on the leaderboard after their first recorded donation.
- Their contact consent flag determines whether hospitals may call them again.
- Their registration source (which hospital registered them) is shown in the
  hospital's donor registry table.

---

## Hospital features (require login)

All hospital pages live under `/dashboard`. Access is guarded by
`proxy.js` + `getSession()` in the page.

### Sign in

- **Route:** `/login`
- **Flow:**
  1. Email + password submitted.
  2. `LoginForm` verifies against the store (`verifyHospitalLogin`).
  3. On success, POSTs to `/api/auth/signin`, which sets an httpOnly cookie.
  4. If `mustChangePassword` is `true`, redirects to `/dashboard/change-password`.
  5. Otherwise, goes straight to `/dashboard`.
- **Blocks:** banned hospitals, unknown emails, wrong passwords.
- **Open-redirect guard:** `next` parameter must start with a single `/`.

### First-login password change

- **Route:** `/dashboard/change-password`
- **Rule:** hospitals that were registered with an OTP must choose a new password.
- **Minimum:** 6 characters.
- **After save:** `mustChangePassword` flips to `false`, and the admin view
  reflects the new password.

### Dashboard — Requests tab

- **What:** all requests posted by this hospital.
- **Actions:**
  - View public page (opens `/requests/[id]`).
  - Mark as fulfilled (sets status to `"fulfilled"`, timestamp recorded).
- **Disabled when:** hospital status is `"banned"`.

### Dashboard — Post new tab

- **Fields:** blood type, city, units, urgency (low/medium/high), notes.
- **Validation:** blood type required, city required, units ≥ 1.
- **Result:** request is prepended to the global list, appears on `/requests` instantly.

### Dashboard — Record donation tab

- **Fields:** donor (dropdown of all donors), request (dropdown of this hospital's open requests).
- **Result:** donation entry created, leaderboard count for that donor increments.
- **Also shows:** history of all donations recorded by this hospital.

### Dashboard — Donor registry tab

- **Form fields:** full name, public name, blood type, city, phone, address, contact consent (Yes/No).
- **When to use:** after the donor has passed a blood test and made their first donation.
- **Result:**
  - Donor marked `verified: true`.
  - `registeredBy` set to this hospital's ID.
  - Appears in the admin donor table and the hospital's own donor table.
- **Consent recorded:** admin and hospital see `Yes` / `No` badge.

### Session state

- Header shows "Hello, {hospital name}" plus a **Dashboard** button.
- Sign-out form clears the cookie via `/api/auth/signout`.

---

## Admin features (hardcoded account)

Access is guarded by a page-level role check (`session.role === "admin"`).

### Admin dashboard

- **Route:** `/admin`
- **6 stat cards:** donors, hospitals, banned hospitals, open requests, fulfilled requests, donations.

### Analytics charts

1. **Donations — last 7 days** — bar chart, one bar per day.
2. **Donations by blood type** — sorted bar chart.
3. **Requests by city** — top 5 cities.
4. **Fulfillment rate** — % of requests marked fulfilled.

All charts are pure CSS — no chart library dependency.

### Hospital management

- **List:** all hospitals with name, city, email, phone, current password, status.
- **Password display:** admin can see the current password at every stage —
  OTP on registration, new password after first login.
- **Register a hospital:** name, city, email, phone, auto-generated 8-char OTP.
  - On success, a red confirmation card shows the OTP — copy it, it is only shown once.
  - New hospital appears in the list immediately with "one-time — not yet changed" badge.
  - Duplicate email rejected.
- **Reset password:** generates a fresh OTP and sets `mustChangePassword: true`.
- **Ban:** hospital can no longer sign in or post requests. Its existing requests remain visible (business rule).
- **Unban:** restores access.

### Donor table (full info)

- Columns: full name, blood type, city, phone, address, consent.
- Includes both verified and self-registered donors.

### Donations log

- Every recorded donation with donor name, hospital name, and date.

### Top donors

- Same leaderboard as `/leaderboard` but includes full names.

---

## System features

### Authentication

- **Cookie:** `session`, `httpOnly: true`, `SameSite=Lax`, 7-day expiry,
  `Secure` in production.
- **Format:** `admin` for admin, `hospital:{email}` for hospitals.
- **Read:** `getSession()` in `lib/session.js`, usable in any Server Component
  or Route Handler.
- **Write:** `app/api/auth/signin/route.js` sets the cookie manually so
  emails with `@` are not URL-encoded.

### Authorization — three layers

1. **`proxy.js`** — early redirect for `/dashboard/*` if no cookie.
2. **Page check** — every dashboard page calls `getSession()` or `useSession()`
   and redirects if the session is missing or the role is wrong.
3. **Store action** — `createRequest` re-checks hospital status before mutating.

### Persistence

- **Storage:** `localStorage` under the key `lifedrop-store-v5`.
- **Sync:** manual. `StoreProvider` loads on mount, subscribes to every change,
  writes back on each state update.
- **Shape:** `{ hospitals[], donors[], requests[], donations[] }`.
- **Reset:** `localStorage.removeItem("lifedrop-store-v5")` in DevTools console.
- **Survives:** page refresh, tab close, browser restart. Does not survive
  "Clear site data."

### SEO

- **Metadata:** template + default in `app/layout.js`.
- **Canonical URLs** on `/requests`, `/requests/[id]`, `/donate`, `/about`, `/leaderboard`.
- **Dynamic metadata** on `/requests/[id]` via `generateMetadata`.
- **Open Graph:** site-wide image (`app/opengraph-image.js`) plus per-request
  image (`app/requests/[id]/opengraph-image.js`).
- **JSON-LD:** `MedicalProcedure` schema on every request detail page.
- **Sitemap:** `app/sitemap.js` — static routes only (requests live in the
  visitor's localStorage, so they cannot be in a server-generated sitemap).
- **Robots:** `app/robots.js` — disallows `/dashboard`, `/login`, `/api/`.

### Optimisation

- **Font:** `next/font/google` Inter, self-hosted at build time.
- **No external requests** at runtime.
- **No chart library** — bar charts are CSS `div` widths.
- **Minimal JS:** Server Components render the shell; client islands only
  where interactivity exists.

### Accessibility

- All form inputs have `<label>` associations.
- Errors rendered with `role="alert"` / `role="status"`.
- `tel:` links for hospital phone numbers.
- Sufficient contrast ratios (WCAG AA) in the red-on-cream palette.

---

## Explicitly not built

These were intentionally excluded to keep the capstone scoped:

- Real backend (Postgres, Prisma) — replaced by localStorage.
- Real password hashing (bcrypt) — replaced by plaintext in the demo store.
- SMS or email notifications — future work.
- Phone number verification (Twilio) — future work.
- Donor-to-hospital in-app messaging — replaced by direct `tel:` links.
- File uploads (ID cards, blood test results) — future work.
- Multi-language support (Amharic) — future work.
- Mobile app — future work.

---

## Business rules enforced (cross-reference)

| Rule                                    | Where enforced                                         |
| --------------------------------------- | ------------------------------------------------------ |
| Admin registers hospitals               | `RegisterHospitalForm` + store `registerHospital`      |
| Hospitals post requests                 | `AddRequestForm` + store `createRequest`               |
| Donors contact hospitals directly       | `tel:` link on `/requests/[id]`                        |
| Requests persist forever                | `StoreProvider` writes on every change                 |
| No auto-expiry                          | No expiry logic anywhere                               |
| No review / no delete                   | No delete action exists                                |
| Admin can ban hospitals                 | `banHospital` / `unbanHospital`                        |
| Admin sees all data                     | `/admin` sections                                      |
| Leaderboard ranks donors                | `/leaderboard` + `/admin` top-donors                   |
| Hospital registers donor after 1st test | `RegisterDonorForm`                                    |
| Contact consent recorded                | `contactConsent` field                                 |
| Public info only on leaderboard         | `/leaderboard` shows full name only — no phone/address |
