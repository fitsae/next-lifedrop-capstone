# Authentication & Authorization — LifeDrop

## Protected routes

| Route                 | Protection                  |
| --------------------- | --------------------------- |
| `/dashboard`          | `proxy.js` + `getSession()` |
| `/dashboard/requests` | same + owner-scoped queries |
| `/login`              | public, `noindex`           |
| Everything else       | public                      |

## Three layers

1. **proxy.js** — matcher `["/dashboard/:path*"]` redirects signed-out users to `/login?next=…`
2. **Page** — every dashboard page calls `getSession()` and redirects if null
3. **Server Action** — `createRequest` re-checks the session before mutating

## Session model

- Cookie `session`, value is a user ID
- `httpOnly`, `secure` in production, `sameSite: "lax"`, 7-day expiry
- Demo credentials: `hospital@lifedrop.et` / `lifedrop123`

## Open redirect protection

`next` must start with a single `/`, must not start with `//`. Anything else falls back to `/dashboard`.
