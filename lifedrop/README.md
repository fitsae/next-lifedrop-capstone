# LifeDrop — Blood Donor & Request Finder

A small, fast, indexable web app for matching blood requests with donors across Ethiopia.

## Stack

- Next.js 15 App Router (JavaScript)
- Server Components + Client islands
- SWR for interactive search
- Server Actions for writes
- Route Handlers for the API
- Plain CSS (no Tailwind)

## Screens

| URL                   | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `/`                   | Home: hero + urgent requests + how it works |
| `/requests`           | Search + filter all open requests           |
| `/requests/:id`       | One request: hospital, contact, notes       |
| `/donate`             | Donor registration form                     |
| `/about`              | Privacy and how it works                    |
| `/login`              | Hospital / admin sign in                    |
| `/dashboard`          | Session-scoped overview                     |
| `/dashboard/requests` | Manage own requests + post new              |

## Run

```bash
npm install
npm run dev
```
