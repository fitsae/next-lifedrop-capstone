## hey friends put your honestly review here(3 strength 3 weakness) thank you

### Review by yeab-dev

**Strengths**

1. Clear feature split: donate, requests, leaderboard, hospital dashboard and admin.
2. Uses current Next.js pieces well (App Router, route handlers, sitemap/robots/OG image).
3. Small, simple state with Zustand and SWR.

**Weaknesses**

1. The session cookie is not signed, so setting `session=admin` makes anyone an admin.
2. Hospital passwords are stored in plain text in the client-side store.
3. No tests, and hook bugs (like the `/dashboard/requests` crash) reached `main`.
