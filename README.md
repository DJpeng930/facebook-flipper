# Facebook Flipper

Facebook Flipper is an Electron desktop app for reviewing Facebook Marketplace listings. The current app can log into Facebook through a local Chrome profile, scrape Marketplace listings from a manual search, ask an AI model to analyse them, and store listings locally for review.

This repository is being adapted into a personal bicycle-flipping tool for finding undervalued bicycles around Sydney. The first priority is to keep the existing app running before adding larger bicycle-specific features.

## Current Status

What the app currently does:

- Opens as a desktop app using Electron.
- Shows a React and Tailwind user interface.
- Uses Google Chrome through Playwright/Patchright for Facebook Marketplace browsing.
- Stores local settings and listing review status with Electron Store.
- Lets listings be marked as pending, saved, or discarded.
- Sends listing text to an AI model through OpenRouter for basic analysis.

What the app does not do yet:

- It does not use SQLite.
- It does not track historical listing snapshots or price changes.
- It does not run scheduled scans.
- It does not identify bicycles with a bicycle catalogue.
- It does not extract bicycle components deterministically.
- It does not use sold/completed comparable evidence.
- It does not have the final deterministic valuation engine.
- It does not send alerts.

## Required Software

Install these first on Windows:

1. GitHub Desktop.
2. Google Chrome.
3. Node.js 18 or newer. npm is installed with Node.js.
4. An OpenRouter account and API key.
5. A Facebook account that can access Marketplace.

A separate Facebook account is recommended because automated scraping can risk Facebook account restrictions.

## Secrets And Credentials

Do not put real passwords, API keys, Facebook cookies, or 2FA codes into GitHub.

Current required secrets:

- OpenRouter API key: entered in the app Settings page after launch.
- Facebook login session: created by logging in through the app-controlled Chrome window.

The current app does not read `.env` automatically. The `.env.example` file only documents the key name that may be used later if environment-file support is added.

## Beginner Windows Setup

### 1. Clone your fork with GitHub Desktop

1. Open GitHub Desktop.
2. Sign in to your GitHub account.
3. Click **File**.
4. Click **Clone repository**.
5. Choose your fork of `facebook-flipper`.
6. Choose a local folder, for example `Documents\GitHub`.
7. Click **Clone**.

### 2. Open the project folder

1. In GitHub Desktop, make sure `facebook-flipper` is selected.
2. Click **Repository**.
3. Click **Show in Explorer**.

### 3. Install dependencies

1. Open the project folder in File Explorer.
2. Click the address bar at the top.
3. Type `powershell`.
4. Press **Enter**.
5. Run:

```powershell
npm install
```

If Windows Defender or another security tool pauses the install, wait a moment and run the command again.

### 4. Start the app

In the same PowerShell window, run:

```powershell
npm run dev
```

The desktop app should open.

### 5. Add your OpenRouter API key

1. Open the app.
2. Go to **Settings**.
3. Paste your OpenRouter API key into the API key field.
4. Save the setting.

### 6. Log in to Facebook

1. Open the app.
2. Use the Facebook login button.
3. Log in manually.
4. Complete any 2FA prompt yourself.

Never send your Facebook password, cookies, or 2FA code to Codex or GitHub.

## Developer Commands

Run a type check:

```powershell
npm run typecheck
```

Run the app in development mode:

```powershell
npm run dev
```

Build the app:

```powershell
npm run build
```

Build the Windows installer/package:

```powershell
npm run build:win
```

## Planned Implementation Stages

### Stage 1: Make the existing app run correctly

- Add safe setup documentation.
- Add `.env.example` with variable names only.
- Confirm dependency installation.
- Confirm required API keys and secrets.
- Fix current build/runtime problems before adding major features.

### Stage 2: Improve data model and storage

- Add SQLite.
- Store listings, listing snapshots, search hits, bicycle identifications, components, comparables, valuations, risks, alerts, settings, and actual purchase/sale outcomes.

### Stage 3: Improve listing collection

- Support multiple search queries.
- Deduplicate overlapping results.
- Store which query found each listing.
- Track price changes, first seen, last seen, and disappearance without assuming sale.

### Stage 4: Build text-only bicycle identification

- Use deterministic extraction first.
- Add bicycle dictionaries and fuzzy matching.
- Use AI only when ambiguity remains.
- Return identity and component confidence scores.

### Stage 5: Build comparable and historical evidence

- Add a modular evidence-source architecture.
- Keep active listings separate from sold/completed evidence.
- Support internal history, CSV, JSON, SQLite, manual imports, and future permitted external sources.

### Stage 6: Build deterministic valuation

- Use robust statistics such as weighted median.
- Show factor-by-factor valuation contributions.
- Avoid simple asking-price averages.

### Stage 7: Add configurable UI controls

- Add search settings, valuation factor toggles, advanced weights, deal thresholds, brands, and categories.

### Stage 8: Add alerts and scheduling

- Add periodic scanning.
- Process only new or materially changed listings.
- Send one alert type first.

### Stage 9: Learn from actual transactions

- Track inspected listings, purchases, repair costs, resale prices, holding time, profit, and rejected-deal reasons.
- Use this data later to improve transparent rules.

## Safety Notes

- Respect Facebook's Terms of Service and privacy rules.
- Do not commit real credentials.
- Do not treat a disappeared listing as sold unless there is real evidence.
- Do not fabricate historical sold prices.
