# Data Strategy — LifeDrop

| Screen                | Data source                            | Fetch strategy                           | Revalidation  |
| --------------------- | -------------------------------------- | ---------------------------------------- | ------------- |
| `/`                   | `lib/requests.js`                      | Server Component (direct)                | Static        |
| `/requests`           | `/api/requests`                        | SWR with `keepPreviousData`              | Filter change |
| `/requests/[id]`      | `lib/requests.js`                      | Server Component, `generateStaticParams` | Static        |
| `/donate`             | none to fetch; posts via Server Action | —                                        | —             |
| `/dashboard`          | `lib/requests.js`                      | Server Component (session-scoped)        | Request post  |
| `/dashboard/requests` | `lib/requests.js` + Server Action      | Server → `revalidatePath`                | Server Action |

## Why the split

- Public lists and details are **static or server-rendered** — no client cost, SEO-friendly.
- Search filtering is **client-side (SWR)** — cheap, keeps filter state in the UI.
- Form writes go through **Server Actions** — validated and re-checked server-side.
