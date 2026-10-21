# LifeDrop — Setup Guide

A step-by-step guide to installing, configuring, running, testing, and building the LifeDrop blood donation platform locally.

## Table of Contents

- [Prerequisites](#1-prerequisites)
- [Clone the Repository](#2-clone-the-repository)
- [Install Dependencies](#3-install-dependencies)
- [Configure Environment Variables](#4-configure-environment-variables)
- [Run the Development Server](#5-run-the-development-server)
- [Sign In with Demo Accounts](#6-sign-in-with-demo-accounts)
- [Test Donor Registration and Donations](#7-test-donor-registration-and-donations)
- [Production Build and Verification](#8-production-build-and-verification)
- [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

Install the following tools before starting.

| Tool    | Requirement           | Verify          |
| ------- | --------------------- | --------------- |
| Node.js | 18.18.0 or higher     | `node -v`       |
| npm     | 9.x or higher         | `npm -v`        |
| Git     | Version 2.x or higher | `git --version` |

Download links:

- [Node.js](https://nodejs.org/)
- [Git for Windows](https://git-scm.com/download/win)

Open Command Prompt or PowerShell and verify the installations:

```bash
node -v
npm -v
git --version
```

Node.js 20 LTS is recommended.

## 2. Clone the Repository

Replace `YOUR-USERNAME` with the GitHub account that owns the repository.

```bash
git clone https://github.com/YOUR-USERNAME/lifedrop.git
cd lifedrop
```

Verify that the project files are present.

**Windows:**

```cmd
dir
```

**macOS/Linux:**

```bash
ls
```

The project root should contain `package.json`, `app/`, and other project files.

> If the repository already exists locally, navigate to its folder instead of cloning it again.

## 3. Install Dependencies

Run this command from the directory containing `package.json`:

```bash
npm install
```

Wait until the installation finishes.

Verify that the dependencies were installed:

```bash
npm ls next react react-dom zustand
```

The project uses Next.js, React, and Zustand. Check `package.json` for the exact versions configured for your project.

## 4. Configure Environment Variables

Create your local environment file from the example.

**Windows Command Prompt:**

```cmd
copy .env.example .env.local
```

**PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS/Linux:**

```bash
cp .env.example .env.local
```

Open `.env.local` and review its values. For the current demo configuration, it may contain:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEMO_PASSWORD=lifedrop123
```

Use the variables actually referenced by your project. If `.env.example` does not exist, check the project documentation and configuration before creating the file manually.

### Environment Variable Notes

| Variable               | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for links and SEO metadata                         |
| `DEMO_PASSWORD`        | Password configuration for the demo authentication flow, if implemented |

**Security requirements:**

- Never commit `.env.local` to Git.
- Never put private secrets in variables prefixed with `NEXT_PUBLIC_`.
- Change demo credentials before deploying.
- Use secure server-side authentication for production.

Verify that Git ignores the local environment file:

```bash
git check-ignore .env.local
```

If the file is not ignored, update `.gitignore` to include:

```gitignore
.env*
!.env.example
```

## 5. Run the Development Server

Start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Keep the terminal running while using the website.

### Verify the Homepage

Confirm that the homepage loads and displays the expected LifeDrop interface, including the navigation, donation requests, and relevant registration or sign-in options.

### Verify the Main Routes

Use the following routes if they exist in your current implementation.

| Route             | Expected result                             |
| ----------------- | ------------------------------------------- |
| `/`               | Homepage and urgent requests                |
| `/requests`       | Request listing and filters                 |
| `/requests/req-1` | Request details                             |
| `/leaderboard`    | Donor leaderboard                           |
| `/donate`         | Donor registration or donation information  |
| `/about`          | Platform information                        |
| `/login`          | Sign-in page                                |
| `/admin`          | Administrator dashboard after authorization |
| `/dashboard`      | Hospital dashboard after authorization      |

The exact routes and sample data depend on the current project implementation.

### Verify Local Demo Data

If the application uses the browser's local storage, open Developer Tools with `F12`, select **Console**, and inspect the configured store.

For a store named `lifedrop-store-v5`, run:

```javascript
JSON.parse(localStorage.getItem("lifedrop-store-v5"));
```

This works only if your application initializes and stores data under that key. Do not assume that a missing value means the application is broken until you verify the actual storage implementation.

## 6. Sign In with Demo Accounts

Use these accounts only if they are configured in the current demo data.

### Administrator

Open `/login` and use:

| Field    | Demo value          |
| -------- | ------------------- |
| Email    | `admin@lifedrop.et` |
| Password | `lifedrop123`       |

After successful authentication, verify that the administrator dashboard opens and that unauthorized users cannot access administrative functionality.

### Hospital

| Field    | Demo value              |
| -------- | ----------------------- |
| Email    | `blacklion@lifedrop.et` |
| Password | `lifedrop123`           |

After successful authentication, verify that the hospital dashboard opens.

Expected hospital functionality may include:

- Viewing blood requests.
- Posting new requests.
- Registering donors.
- Recording donations.
- Viewing donor records.

> Demo account credentials are examples from the development setup. They will work only if the corresponding accounts and authentication logic exist in your current code.

### Verify Hospital Registration and OTP

If your implementation supports one-time passwords (OTPs):

1. Sign in as an administrator.
2. Register a test hospital.
3. Record the generated OTP.
4. Sign in using the new hospital account and OTP.
5. Change the temporary password.
6. Sign in again using the new password.
7. Verify that the hospital dashboard opens.

Confirm that the OTP expires or becomes invalid after the intended use, if that behavior is implemented.

## 7. Test Donor Registration and Donations

Sign in using a hospital demo account.

### Register a Test Donor

Use sample information such as:

| Field           | Test value  |
| --------------- | ----------- |
| Full name       | Test Donor  |
| Public name     | Test D.     |
| Blood type      | O+          |
| City            | Addis Ababa |
| Phone           | 0911112233  |
| Address         | Bole        |
| Contact consent | Yes         |

Use the registration form provided by your application.

### Record a Donation

1. Open the donation-recording section.
2. Select the registered donor.
3. Select an eligible blood request.
4. Submit the donation record.
5. Confirm that a success message appears.

### Verify the Results

- The donor appears in the donor registry.
- The donation appears in the donation history.
- The leaderboard updates if it is connected to donation records.
- The administrator can view the appropriate donor and donation information.
- Contact information is displayed only according to the application's privacy and consent rules.

### Reset Demo Data

If the application uses the `lifedrop-store-v5` local-storage key, you can reset the browser's demo data with:

```javascript
localStorage.removeItem("lifedrop-store-v5");
location.reload();
```

**Warning:** This removes data stored under that key in the current browser. Use it only for development testing, and confirm that you do not need the existing data first.

## 8. Production Build and Verification

Stop the development server with `Ctrl+C`.

Run the production build:

```bash
npm run build
```

Resolve any compilation errors before continuing.

A successful build should finish without a `Failed to compile` error.

Start the production server locally:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) and test the production build.

### Production Checklist

- [ ] Homepage loads.
- [ ] Main routes render correctly.
- [ ] Request filters work.
- [ ] Request details display correctly.
- [ ] Login and logout work.
- [ ] Protected pages reject unauthorized access.
- [ ] Hospital registration works, if implemented.
- [ ] OTP and password-change flows work, if implemented.
- [ ] Donor registration works.
- [ ] Donation records are saved correctly.
- [ ] Leaderboard data updates correctly.
- [ ] No critical browser-console errors occur.

### Verify SEO Routes

If the project implements `robots.txt` and `sitemap.xml`, check:

- [http://localhost:3000/robots.txt](http://localhost:3000/robots.txt)
- [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)

Ensure that the sitemap contains appropriate public pages and does not expose private dashboard or account URLs unnecessarily.

For Next.js projects, these files can be implemented using `app/robots.ts` and `app/sitemap.ts`, or the corresponding supported file formats.

## 9. Troubleshooting

| Problem                           | Suggested fix                                                             |
| --------------------------------- | ------------------------------------------------------------------------- |
| `node` or `npm` is not recognized | Install Node.js and restart the terminal.                                 |
| `git` is not recognized           | Install Git and restart the terminal.                                     |
| `package.json` not found          | Navigate to the project root.                                             |
| Dependency installation fails     | Check the Node.js version and npm error output.                           |
| Port 3000 is already in use       | Stop the other process or run `npm run dev -- -p 3001`.                   |
| Module not found                  | Verify the import path, filename, and installed dependencies.             |
| Environment variable is undefined | Check `.env.local` and restart the development server.                    |
| Page returns 404                  | Confirm the route's corresponding file under `app/`.                      |
| Hydration errors                  | Compare server-rendered and client-rendered output.                       |
| `useSearchParams()` build error   | Follow the Next.js error guidance; a `Suspense` boundary may be required. |
| Production build fails            | Read the first compilation error and fix the reported file and line.      |
| Dashboard access denied           | Verify the signed-in account, role, and server-side authorization rules.  |
| Demo data is missing              | Verify the storage key and seed-data initialization logic.                |

### Clear the Next.js Build Cache

Stop the server first.

**Windows Command Prompt:**

```cmd
rmdir /s /q .next
```

**PowerShell:**

```powershell
Remove-Item -Recurse -Force .next
```

**macOS/Linux:**

```bash
rm -rf .next
```

Then rebuild:

```bash
npm run build
```

## Additional Documentation

Refer to these files if they exist in your repository:

- `README.md` — Project overview and core features.
- `FEATURES.md` — Feature inventory by user role.
- `BUSINESS.md` — Business rules and permissions.
- `AUTH.md` — Authentication and authorization architecture.
- `.env.example` — Required environment variables.

---

**LifeDrop Setup Guide**

Keep this document updated whenever the installation process, environment variables, demo accounts, or project architecture changes.
