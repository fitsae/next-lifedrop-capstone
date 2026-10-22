# LifeDrop --- Performance Report

Measurements, optimisations, and before/after results for the LifeDrop
capstone.

> **Measurement integrity:** The figures below are the measurements
> supplied for this report. Only describe them as verified measurements
> if you have actually reproduced them using the methodology in this
> document.

------------------------------------------------------------------------

## 1. Executive summary

  Metric                                                    Value      Target Status
  ------------------------------------------------------ -------- ----------- --------
  First Contentful Paint (FCP)                              0.7 s    \< 1.0 s ✅
  Largest Contentful Paint (LCP)                            1.0 s    \< 2.5 s ✅
  Time to Interactive (TTI)                                 1.3 s    \< 3.8 s ✅
  Total Blocking Time (TBT)                                 90 ms   \< 200 ms ✅
  Cumulative Layout Shift (CLS)                              0.01      \< 0.1 ✅
  First Load JS (largest route)                            100 kB   \< 150 kB ✅
  CSS (total)                                               11 kB    \< 30 kB ✅
  Runtime dependencies                                          4         --- ✅
  External network requests (excluding the app itself)          0         --- ✅

The reported values meet the stated targets. The reported runtime has
zero external requests, and the largest route's First Load JS is below
the stated 150 kB budget.

------------------------------------------------------------------------

## 2. Measurement methodology

### Environment

-   **Build:** `npm run build` --- production, minified, tree-shaken.
-   **Server:** `npm run start` --- Next.js 15 production server on
    `localhost:3000`.
-   **Browser:** Chrome 130+ in a fresh incognito window.
-   **Device emulation:** Moto G Power profile (Slow 4G, 1.6 Mbps down /
    750 Kbps up, 150 ms RTT, 4× CPU throttle).
-   **Network:** Throttled to Slow 4G for Core Web Vitals; unthrottled
    for bundle-size analysis.
-   **Cache:** Cleared before every measurement.
-   **Runs:** Five measurements per metric, with the median reported.

### Tools

  -----------------------------------------------------------------------
  Tool                                What it measures
  ----------------------------------- -----------------------------------
  Chrome DevTools → Lighthouse panel  Core Web Vitals and Performance
                                      score

  Chrome DevTools → Network panel     Request count, waterfall, and
                                      transfer sizes

  Chrome DevTools → Coverage panel    Unused JavaScript and CSS

  `npm run build` output              Route-by-route bundle sizes

  React DevTools → Profiler           Component render counts and
                                      durations
  -----------------------------------------------------------------------

### What is not measured here

-   Real-user metrics (no RUM is configured in this project).
-   Server CPU time (no server-side data queries are part of this
    build).
-   Database latency (the demo uses `localStorage`, not a real
    database).

------------------------------------------------------------------------

## 3. Bundle size analysis

### Route-by-route (`npm run build` output)

  Route                    Page size   First Load JS
  ---------------------- ----------- ---------------
  `/`                         2.1 kB           95 kB
  `/about`                    1.2 kB           94 kB
  `/admin`                    6.8 kB          100 kB
  `/dashboard`                5.4 kB           99 kB
  `/donate`                   2.3 kB           96 kB
  `/leaderboard`              2.7 kB           96 kB
  `/login`                    2.1 kB           95 kB
  `/requests`                 3.2 kB           97 kB
  `/requests/[id]`            1.8 kB           96 kB
  `/_not-found`                890 B           90 kB
  Shared by all routes           ---           87 kB

The reported shared baseline is 87 kB (Next.js framework, React, React
DOM, and Next runtime). Each route adds approximately 8--13 kB. The
largest route, `/admin`, adds approximately 13 kB for its stat cards,
charts, hospital management, donor table, donations log, and top donors.

### Dependency breakdown

  ---------------------------------------------------------------------------
  Package / area                Minified              Gzipped Purpose
  ----------------- -------------------- -------------------- ---------------
  `next`                        \~180 kB              \~62 kB App Router,
  (framework)                                                 SSR, routing,
                                                              Image, Font

  `react` +                     \~140 kB              \~45 kB Component
  `react-dom`                                                 runtime

  `zustand`                     \~1.2 kB             \~0.6 kB Store

  App code (pages,               \~28 kB               \~9 kB Application
  components, and                                             code
  lib)                                                        

  CSS                            \~35 kB              \~11 kB Styles
  (`globals.css`)                                             
  ---------------------------------------------------------------------------

**Reported total production bundle (gzipped, all routes summed):** \~128
kB.\
**Reported First Load JS for the largest route:** \~100 kB.

These figures should be interpreted using the same size definition and
build output each time. Summing route sizes can count shared chunks more
than once, so it is not necessarily the unique total download size for a
user.

### Runtime dependency count: 4

-   `next`
-   `react`
-   `react-dom`
-   `zustand`

This is the complete runtime `dependencies` list described for this
project. Development tools, if any, belong in `devDependencies` and are
not runtime dependencies.

------------------------------------------------------------------------

## 4. Network waterfall

### Home page --- production, Slow 4G, cold cache

  -------------------------------------------------------------------------------------------------------------
               \# Request                                                Size            Time Purpose
  --------------- ------------------------------------------- --------------- --------------- -----------------
                1 `GET /` (HTML)                                       4.2 kB          180 ms Server-rendered
                                                                                              HTML

                2 `GET /_next/static/css/*.css`                         11 kB           95 ms CSS

                3 `GET /_next/static/chunks/framework-*.js`        45 kB (gz)          240 ms React + React DOM

                4 `GET /_next/static/chunks/main-*.js`             62 kB (gz)          320 ms Next.js runtime

                5 `GET /_next/static/chunks/app/page-*.js`          9 kB (gz)           85 ms Home page code

                6 `GET /icon.svg`                                       340 B           40 ms Favicon

              --- **Total**                                      **\~131 kB**    **\~960 ms** ---
  -------------------------------------------------------------------------------------------------------------

**Reported total:** six requests and zero external requests.

Treat this table as a recorded example, not a universal Next.js request
count. Actual chunk names, compression, transfer sizes, caching, and
request counts vary by build, browser, and route. Verify them in
DevTools for the current build.

### Comparison to a typical Next.js setup

A setup that includes Tailwind, shadcn/ui, a chart library, form
libraries, and remotely loaded fonts may transfer more assets. The
following is an illustrative estimate, not a controlled benchmark:

  -----------------------------------------------------------------------
  Item                Approx. requests / chunks     Illustrative transfer
  ------------------- ------------------------- -------------------------
  Framework                                   4                    107 kB

  Tailwind CSS                               +1                +30--60 kB

  shadcn/ui                            +1 chunk                    +40 kB
  components and                                
  primitives                                    

  Recharts or                          +1 chunk                +50--80 kB
  Chart.js                                      

  React Hook Form +                    +1 chunk                    +25 kB
  Zod                                           

  Google Fonts                      +2 requests  Up to \~80 kB, depending
  (Inter)                                          on weights and caching

  **Illustrative              **\~10 requests**         **\~330--390 kB**
  total**                                       
  -----------------------------------------------------------------------

Actual overhead depends on which components are imported, tree-shaking,
CSS purging, code splitting, compression, and font weights. Do not use
this estimate as a universal comparison for every Next.js project.

### Font loading

When `next/font/google` is used correctly, Next.js downloads font files
at build time and serves the resulting assets from the application
rather than making runtime requests to Google Fonts.

-   Font files are self-hosted by the build.
-   Only the configured weights and subsets should be included.
-   `font-display` behavior is managed by Next.js.
-   Check the production Network panel to confirm the actual font
    requests and ensure there are no requests to `fonts.googleapis.com`
    or `fonts.gstatic.com`.

------------------------------------------------------------------------

## 5. Core Web Vitals

### Reported results on Slow 4G + 4× CPU throttle

  Route                   FCP     LCP      TBT    CLS     TTI
  ------------------- ------- ------- -------- ------ -------
  `/`                   0.7 s   0.9 s    70 ms   0.00   1.2 s
  `/requests`           0.8 s   1.1 s    90 ms   0.01   1.4 s
  `/requests/req-1`     0.7 s   0.9 s    60 ms   0.00   1.1 s
  `/login`              0.7 s   0.9 s    50 ms   0.00   1.0 s
  `/dashboard`          0.8 s   1.1 s   110 ms   0.01   1.5 s
  `/admin`              0.8 s   1.2 s   140 ms   0.02   1.6 s
  `/leaderboard`        0.7 s   0.9 s    80 ms   0.01   1.2 s

These are the supplied results; reproduce them on the current production
build before presenting them as independently verified measurements. TTI
is a legacy Lighthouse metric and may not be available in all current
Lighthouse reports. For current assessments, also record Interaction to
Next Paint (INP) where real-user data is available.

### What each metric means

**FCP (First Contentful Paint) --- reported 0.7--0.8 s.**\
The time until the browser renders the first text, image, or other
content. Server-rendered HTML can help content appear before client-side
JavaScript has finished loading.

**LCP (Largest Contentful Paint) --- reported 0.9--1.2 s.**\
The time until the largest visible content element is rendered. The
reported largest element is the home-page hero heading or the admin stat
grid. Confirm the actual LCP element in Lighthouse or the Performance
panel.

**TBT (Total Blocking Time) --- reported 50--140 ms.**\
The total time between FCP and Time to Interactive during which long
tasks block the main thread beyond the allowed threshold. The admin page
may have more JavaScript work due to its charts and dashboard UI;
profile before attributing the cost to a particular calculation.

**CLS (Cumulative Layout Shift) --- reported 0.00--0.02.**\
A measure of unexpected layout movement. Stable dimensions, predictable
loading states, and avoiding content inserted above existing content
help keep CLS low.

**TTI (Time to Interactive) --- reported 1.0--1.6 s.**\
A historical Lighthouse metric describing when a page becomes reliably
interactive. It is not a Core Web Vital and is deprecated in modern
Lighthouse reporting; use it only when the tool version reports it.

------------------------------------------------------------------------

## 6. Optimisation log --- before and after

The following entries describe the architecture and expected rationale.
Any "saved" size or timing is an estimate unless it was isolated and
measured in a controlled before-and-after build.

### 6.1 --- No CSS framework

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Tailwind CSS            Hand-written CSS in
                                                  `globals.css`

  CSS size                Estimated 30--60 kB for Reported 11 kB
                          the assumed setup       

  Build time              Potentially +2--4 s in  No Tailwind generation
                          the assumed setup       step

  **Estimated             ---                     **\~25 kB CSS and 2--4
  difference**                                    s of build time**
  -----------------------------------------------------------------------

**Why:** The app has a small set of UI styles. Hand-written CSS avoids
framework setup and may reduce output for a small application. The
actual difference depends on Tailwind configuration, purging, and the
styles used.

### 6.2 --- No component library

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                shadcn/ui and its       Hand-written HTML and
                          underlying primitives   CSS

  JS size                 Estimated +40--60 kB    No component-library
                          for the assumed         overhead
                          component set           

  **Estimated             ---                     **\~50 kB JS**
  difference**                                    
  -----------------------------------------------------------------------

**Why:** The current interface uses a small set of custom components. A
component library can improve accessibility and consistency, but it also
adds dependencies and implementation surface. Measure the actual bundle
before claiming a precise saving.

### 6.3 --- No chart library

                             Naive approach         Shipped approach
  -------------------------- ---------------------- ---------------------------------
  Approach                   Recharts or Chart.js   CSS bars with calculated widths
  JS size                    Estimated +50--80 kB   No chart-library dependency
  **Estimated difference**   ---                    **\~65 kB JS**

**Why:** The admin dashboard uses simple bar charts that can be
represented with HTML and CSS. For example:

``` jsx
<div
  style={{
    background: "#f0e0e0",
    borderRadius: 4,
    height: 14,
  }}
>
  <div
    style={{
      width: `${(value / max) * 100}%`,
      background: "#d32f2f",
      height: "100%",
    }}
  />
</div>
```

This avoids a chart-library dependency for a simple bar. Ensure the
chart also has an accessible label or text equivalent, and guard against
`max` being zero.

### 6.4 --- No React Hook Form + Zod

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                React Hook Form + Zod   `useState` and inline
                          schema                  validation

  JS size                 Estimated +25--30 kB    No form-library
                                                  overhead

  Validation code         Around 15 lines per     Around 20 lines
                          simple schema           imperative code
                          (estimate)              (estimate)

  **Estimated             ---                     **\~27 kB JS**
  difference**                                    
  -----------------------------------------------------------------------

**Why:** The forms are small, with roughly 4--8 fields each.
Hand-written validation is reasonable at this scale, provided it handles
required fields, invalid input, and accessible error messages. A schema
library becomes more attractive as validation rules grow.

### 6.5 --- Zustand without a query library

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Zustand plus SWR or     Zustand only
                          TanStack Query          

  Data access             HTTP requests with      Synchronous
                          caching and             browser-storage state
                          revalidation            

  JS size                 Estimated +15--25 kB    No query-library
                                                  overhead

  **Estimated             ---                     **\~20 kB JS**
  difference**                                    
  -----------------------------------------------------------------------

**Why:** Query libraries are useful for server data, caching,
deduplication, and revalidation. If the application only reads local
browser storage, those features may not provide enough value to justify
the dependency.

### 6.6 --- `next/font` for Inter

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                External Google Fonts   `next/font/google`
                          `<link>`                

  Runtime requests to     CSS plus font files may None when fonts are
  Google                  be requested            correctly self-hosted

  External dependency at  Yes                     No
  runtime                                         

  **Potential benefit**   ---                     Fewer external requests
                                                  and more control over
                                                  font loading
  -----------------------------------------------------------------------

**Why:** Self-hosting fonts removes the runtime dependency on Google's
font hosts. The exact FCP difference is environment-dependent and should
be measured rather than assumed to be a fixed 150 ms.

### 6.7 --- Server Components for static pages

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Every page is a Client  Static pages use Server
                          Component               Components where
                                                  possible

  Page-specific           Additional component    Little or no
  JavaScript              code and hydration      page-specific
                                                  JavaScript for purely
                                                  static content

  **Potential benefit**   ---                     Less client JavaScript
                                                  and hydration work
  -----------------------------------------------------------------------

**Why:** Static pages such as About and not-found content generally do
not need client-side state. In the App Router, a Server Component is not
sent to the browser as a hydrated component, although the browser still
receives the HTML and any required framework/client chunks. Confirm each
route's actual implementation before asserting that it ships zero
JavaScript.

### 6.8 --- `useHydrated()` gate

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Render browser-store    Use a hydration-aware
                          data immediately        loading state

  Risk                    Server/client markup    Consistent initial
                          mismatch or a flash of  output before browser
                          incorrect content       data is ready

  **Potential benefit**   ---                     Fewer hydration
                                                  inconsistencies and
                                                  layout shifts
  -----------------------------------------------------------------------

**Why:** `localStorage` is unavailable during server rendering. A
consistent initial loading state can prevent server/client markup
mismatches while the browser store loads. A hydration gate does not
automatically eliminate all layout shift; reserve space and measure CLS
to confirm the result.

### 6.9 --- Narrow Zustand selectors

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Subscribe to the entire Select only the state
                          store                   slice needed

  Re-renders              Unrelated store changes Components can avoid
                          can trigger more        updates when their
                          renders                 selected value is
                                                  unchanged

  **Potential benefit**   ---                     Fewer unnecessary
                                                  re-renders
  -----------------------------------------------------------------------

**Why:** Components should subscribe only to the state they use. For
example, a header that reads an item count should not subscribe to every
donation record. The exact reduction depends on the component tree and
update patterns; profile with React DevTools.

### 6.10 --- Memoise filtering computations

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Filter arrays during    `useMemo` with correct
                          every render            dependencies

  At 10 records           Usually negligible      Usually negligible

  At 1,000 records        Repeats filtering on    Recomputes when
                          each render             relevant dependencies
                                                  change

  **Potential benefit**   ---                     Less repeated
                                                  computation for larger
                                                  lists
  -----------------------------------------------------------------------

**Why:** Memoisation can help when a calculation is expensive or renders
frequently. For very small arrays, the difference is often unmeasurable.
Correctness comes first: dependencies must include every value used by
the computation.

### 6.11 --- Move time-dependent calculations out of render

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Calculate               Initialise
                          date-dependent values   browser-dependent
                          during                  values in an effect
                          memoisation/render      when appropriate

  Risk                    Server/client output    Browser-only work is
                          can differ, and         deferred until after
                          build-time rules may    hydration
                          flag impure render      
                          logic                   

  **Potential benefit**   ---                     More predictable
                                                  rendering and fewer
                                                  hydration mismatches
  -----------------------------------------------------------------------

**Why:** `new Date()` is valid JavaScript during rendering, but using
the current time to produce different server and client markup can cause
hydration mismatches. Use a stable server value, pass the date as a
prop, or defer genuinely browser-specific calculations to an effect. An
effect should not be used solely to silence a build warning without
understanding its cause.

### 6.12 --- Explicit `localStorage` synchronisation

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Zustand persistence     Manual subscription and
                          middleware              storage synchronisation
                                                  in a provider

  Debug visibility        Depends on middleware   Can explicitly log or
                          configuration and error handle write failures
                          handling                

  **Potential benefit**   ---                     Clearer control over
                                                  loading, writes, and
                                                  error handling
  -----------------------------------------------------------------------

**Why:** Explicit synchronisation can be easier to debug when the data
shape is small. However, persistence middleware is not inherently
unreliable; it can be configured with migration, versioning, and error
handling. Whichever approach is used, validate stored data and handle
unavailable storage and quota errors.

### 6.13 --- Shared session state

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Fetch `/api/me`         Keep auth state in a
                          whenever the auth       root-level component
                          navigation component    across client
                          mounts                  navigation

  Expected behaviour      Repeated requests if    Fewer requests while
                          the component remounts  the root layout remains
                                                  mounted

  **Potential benefit**   ---                     Avoid repeated session
                                                  requests during
                                                  client-side navigation
  -----------------------------------------------------------------------

**Why:** A persistent root layout can keep client state alive during App
Router navigation. This does not mean authentication can rely on client
state alone: protected server resources and mutations must validate the
session on the server. Verify the actual request count in DevTools.

### 6.14 --- Static sitemap and robots metadata

  -----------------------------------------------------------------------
                          Naive approach          Shipped approach
  ----------------------- ----------------------- -----------------------
  Approach                Generate metadata from  Return static,
                          browser-only store data crawlable routes

  Server data access      `localStorage` is       Static route list is
                          unavailable on the      available at build time
                          server                  

  Caching                 May be dynamic or       Static output can be
                          incorrect if based on   cached
                          unavailable data        

  **Potential benefit**   ---                     Predictable metadata
                                                  and cacheability
  -----------------------------------------------------------------------

**Why:** Server-side sitemap generation cannot read each visitor's
`localStorage`. A static list of public routes is appropriate when
user-specific records live only in the browser. Do not include private
or user-specific URLs in a public sitemap.

------------------------------------------------------------------------

## 7. Architectural trade-offs

### Trade-off 1 --- `localStorage` instead of a database

  -----------------------------------------------------------------------
  Capability              Database backend        Current browser-storage
                                                  demo
  ----------------------- ----------------------- -----------------------
  Server Components can   Yes                     No
  query shared data                               

  Initial HTML includes   Yes, when implemented   No for browser-only
  server-fetched records                          data

  Data shared across      Yes, with               No
  devices and users       authentication and      
                          access control          

  Real-time updates       Possible with           No built-in cross-user
  between users           additional              updates
                          infrastructure          

  Setup complexity        Database, schema,       Low
                          migrations, server      
                          operations              

  Persistence             Server-side, subject to Browser-local and
                          backend policy          user-controlled
  -----------------------------------------------------------------------

**Decision:** The capstone demo uses `localStorage` to avoid introducing
a backend during the frontend-focused stage.

**Consequence:** Data is not a shared, reliable system of record.
Browser storage can be cleared, edited by the user, or unavailable in
some contexts. It must not be treated as secure storage or as proof of a
donation.

**Reversal path:** Introduce an authenticated backend and database,
validate every request server-side, and migrate store operations to API
calls or server-side data access. Replace browser-only persistence
gradually; UI components may still need changes to handle asynchronous
loading, errors, and authentication.

### Trade-off 2 --- No SWR / TanStack Query

  -----------------------------------------------------------------------
  With a query library                Current approach
  ----------------------------------- -----------------------------------
  Useful for HTTP requests, caching,  Browser-local state does not need
  deduplication, and revalidation     network-query caching

  Additional dependency and           Smaller dependency surface
  configuration                       
  -----------------------------------------------------------------------

**Decision:** Do not add a query library until server-data fetching and
caching requirements justify it.

### Trade-off 3 --- Plain CSS instead of Tailwind

  -----------------------------------------------------------------------
  Tailwind                            Plain CSS
  ----------------------------------- -----------------------------------
  Utility classes and design-system   Explicit styles in `globals.css`
  conventions                         

  Can be convenient for teams and     Can be smaller for a small,
  large UIs                           carefully scoped app

  Build processing depends on setup   No Tailwind generation step
  -----------------------------------------------------------------------

**Decision:** For a single-developer project with a modest style
surface, hand-written CSS is a reasonable choice. Bundle and build-time
differences should be measured on the actual project.

### Trade-off 4 --- No component library

  -----------------------------------------------------------------------
  Component library                   Hand-written components
  ----------------------------------- -----------------------------------
  Provides reusable patterns and may  Keeps the dependency surface small
  include accessibility behaviour     

  May add primitives and setup        Requires the project to implement
                                      and test accessibility details

  Consistent established interaction  Full control over the UI
  patterns                            
  -----------------------------------------------------------------------

**Accessibility note:** Hand-written components must be tested for
keyboard operation, visible focus, semantic labels, error announcements,
dialog focus management, and appropriate ARIA attributes. A library does
not automatically make an application accessible, but replacing one
means the team owns these responsibilities.

------------------------------------------------------------------------

## 8. What was not optimised, and why

### 8.1 --- Image optimisation

The described interface has no significant raster imagery; the blood
drop is represented by an emoji and SVG. If substantial images are
added, use `next/image` where appropriate, provide dimensions or aspect
ratios, and optimise formats and sizes.

### 8.2 --- Route-level code splitting

Next.js automatically splits route code. Verify the generated chunks and
make sure large admin-only dependencies are not imported by public
pages.

### 8.3 --- Prefetching

`next/link` can prefetch routes when links enter the viewport, depending
on route type and configuration. Confirm behaviour in production rather
than assuming every route is always prefetched.

### 8.4 --- React Server Components for data pages

Browser-only `localStorage` data cannot be read directly by a Server
Component. Shared data should move to a server-side source before
server-rendered data pages are introduced.

### 8.5 --- Streaming and Suspense boundaries

The login page uses `<Suspense>` where required by hooks such as
`useSearchParams`. Other pages may render synchronously from browser
storage. Add Suspense boundaries when they improve loading behaviour,
not merely to increase their number.

### 8.6 --- Component memoisation

`React.memo` can reduce renders when props remain stable and rendering
is expensive. It can also add complexity. Use React DevTools Profiler to
find a real bottleneck before adding memoisation.

### 8.7 --- Partial prerendering

Partial prerendering availability and stability depend on the Next.js
version and configuration. It is not necessary unless the application
has a clear use case and the feature is supported by the chosen version.

### 8.8 --- Web Workers

The described workload has no known CPU-heavy operation that requires a
Web Worker. Reassess if large datasets, expensive transforms, or other
main-thread bottlenecks appear.

------------------------------------------------------------------------

## 9. Reproducing the measurements

Run these commands from the project root:

``` bash
npm install
npm run build
npm run start
```

The production server should start at `http://localhost:3000` unless
configured otherwise. Keep it running while testing.

### Bundle analysis

1.  Run `npm run build`.
2.  Save the terminal output.
3.  Record the page size and First Load JS for each route.
4.  Compare the output with Section 3.
5.  Note the Node.js version, Next.js version, lockfile state, and build
    configuration so repeated builds are comparable.

### Lighthouse / loading metrics

1.  Open Chrome in an incognito window.
2.  Visit `http://localhost:3000`.
3.  Open DevTools (`F12`) and choose **Lighthouse**.
4.  Select mobile emulation and the available simulated Slow 4G
    throttling profile.
5.  Run the audit and record FCP, LCP, TBT, CLS, and any reported
    interactivity metrics.
6.  Repeat five times per route and calculate the median.
7.  Repeat for `/requests`, `/requests/req-1`, `/login`, `/dashboard`,
    `/admin`, and `/leaderboard`.

Lighthouse's simulated throttling does not necessarily match the exact
network profile described in Section 2. Record the actual Lighthouse
version and throttling settings.

### Network request count

1.  Open DevTools → **Network**.
2.  Enable **Disable cache** while DevTools is open.
3.  Hard reload (`Ctrl+Shift+R` on Windows/Linux).
4.  Record request count, transferred bytes, and timings.
5.  Filter for `googleapis` and `gstatic`; expect no matches if all
    fonts are self-hosted.
6.  Distinguish requests to the application from third-party requests,
    and avoid double-counting cached resources.

### Bundle coverage

1.  Open DevTools → **Coverage** (via the DevTools command menu or
    **More tools → Coverage**, depending on the Chrome version).
2.  Start coverage and reload the home page.
3.  Record used and unused JavaScript/CSS.
4.  Repeat for a representative data-heavy route.

Unused-JavaScript percentages vary by route and by which interactions
have been exercised. Do not assume a fixed percentage without recording
the result.

### Render-count analysis

1.  Install the React DevTools extension.
2.  Open `/admin`.
3.  Go to **Profiler** and start recording.
4.  Trigger a representative action, such as a hospital status change.
5.  Stop recording and inspect which components rendered and how long
    they took.
6.  Record the observed result rather than assuming only a specific row
    and parent rendered.

------------------------------------------------------------------------

## 10. Regression prevention checklist

### Bundle

-   [ ] Adding a package requires a written justification describing its
    purpose and why existing code is insufficient.
-   [ ] Any package expected to add more than 10 kB gzipped requires
    maintainer review.
-   [ ] `npm run build` should keep First Load JS below 150 kB on every
    route, unless an approved budget change is documented.

### Rendering

-   [ ] Zustand selectors should return the specific primitive or stable
    slice the component needs; avoid subscribing to the whole store
    unnecessarily.
-   [ ] Filtering, sorting, and reducing should occur in a suitable
    memoised computation when profiling shows a benefit, not in a
    selector that creates a new value on every read.
-   [ ] Components that depend on browser-only state should use a
    consistent initial render and handle hydration correctly.
-   [ ] Hooks must run unconditionally and before any early return in a
    component.
-   [ ] Avoid non-deterministic render output. Date/time and random
    values that affect initial markup should be made hydration-safe.

### Network

-   [ ] Do not add external CSS or font hosts without a documented
    reason; prefer `next/font` and local CSS where suitable.
-   [ ] Use `next/image` where appropriate for optimised images.
-   [ ] Use `next/link` for internal navigation.
-   [ ] Recheck runtime requests after adding a third-party dependency
    or integration.

### Data flow and security

-   [ ] Validate all input before changing application state.
-   [ ] Validate authorization on the server for every protected
    operation; client-side checks are not security boundaries.
-   [ ] Keep browser-storage writes in the chosen persistence layer
    rather than scattering `localStorage.setItem` calls across
    components.
-   [ ] Keep browser-storage reads in the chosen loading/persistence
    layer rather than scattering `localStorage.getItem` calls across
    components.
-   [ ] Treat `localStorage` as user-editable, untrusted data; validate
    its shape and handle parse errors.
-   [ ] Never store passwords, session secrets, or sensitive identity
    data in `localStorage`.

### Verification cadence

-   [ ] Run `npm run build` before every commit.
-   [ ] Run Lighthouse on `/admin` before merging changes that
    materially affect the dashboard.
-   [ ] Re-run bundle analysis after adding a package or changing build
    configuration.
-   [ ] Keep a dated record of benchmark environment, runs, medians, and
    raw reports.

------------------------------------------------------------------------

## 11. Benchmarks against assessment criteria

  -----------------------------------------------------------------------
  Criterion                           How the current report addresses it
  ----------------------------------- -----------------------------------
  Fast loading on mobile networks     Supplied results report LCP below
                                      1.2 s; reproduce to verify

  Efficient JavaScript                Supplied results report 100 kB
                                      maximum First Load JS

  No external runtime dependencies    Reported zero external requests;
                                      verify in Network

  Server-first rendering              Static pages use Server Components
                                      where appropriate; browser-store
                                      pages require client-side state

  Accessible loading states           Hydration-aware loading state is
                                      intended to avoid incorrect initial
                                      content; accessibility must be
                                      tested

  Low layout shift                    Supplied results report CLS no
                                      higher than 0.02

  Verifiable measurements             Section 9 gives a repeatable test
                                      procedure
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 12. Performance budget summary

  Asset / metric                    Reported current value   Budget   Headroom
  ------------------------------- ------------------------ -------- ----------
  First Load JS (largest route)                     100 kB   150 kB      50 kB
  CSS total                                          11 kB    30 kB      19 kB
  Runtime dependencies                                   4        6          2
  External runtime requests                              0        0        ---
  FCP (Slow 4G)                                      0.7 s    1.5 s      0.8 s
  LCP (Slow 4G)                                      1.2 s    2.5 s      1.3 s
  TBT (Slow 4G)                                     140 ms   300 ms     160 ms
  CLS                                                 0.02     0.10       0.08
  Requests on home page                                  6       10          4

Any change that exceeds a budget needs a written justification and,
where practical, a corresponding reduction elsewhere. Treat the budget
as a guardrail against gradual performance regressions, and update the
"current" column only from fresh measurements.

------------------------------------------------------------------------

**End of `PERF.md`**
