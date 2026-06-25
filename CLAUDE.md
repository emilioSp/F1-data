# F1 Data — Project Notes

Next.js app (App Router, React 19, TypeScript) + Postgres, showing F1 season/GP data pulled from
Formula 1's own live-timing API via a custom crawler.

## Stack
- Next.js 16, React 19, TypeScript
- Postgres 18 (via `docker-compose.yml`, container `f1-data-postgres-1`), Knex as query builder
- Tailwind CSS v4
- Biome for lint/format (`npm run lint`, `npm run format`)

## Commands
- `npm run dev` / `build` / `start` — Next.js app
- `npm run migrate` — run Knex migrations (`migrations/`)
- `npm run new:migration` — scaffold a new migration
- `npm run hydrate` — `node lib/crawler/index.ts <year>`, crawls one season into Postgres
- `npm run hydrate-all` — crawls every year in `lib/years.ts` (`AVAILABLE_YEARS`)

## Database schema (`migrations/`)
Five tables, all upserts keyed for idempotent re-crawling:
- **`grand_prixs`** — one row per GP weekend. `id` is F1's own numeric `Meeting.Key` (not
  generated). `UNIQUE(year, name)`. Nullable `sprint_qualifying_path`/`sprint_path` (not every GP
  has a sprint).
- **`sessions`** — one row per session (qualifying/race/sprint/sprint_qualifying) within a GP.
  `type` is a Postgres ENUM `session_type`. `id` is F1's own session key. FK → `grand_prixs`.
  `UNIQUE(gp_id, type)` — exactly one session per type per GP. Stores UTC (`start_date`,
  `TIMESTAMPTZ`) and local wall-clock (`start_date_local`, `TIMESTAMP`) times, plus weather
  (`air_temp`, `track_temp`, `humidity`, all `NUMERIC(5,2)`).
- **`drivers`** — `id UUID DEFAULT uuidv7()` (drivers don't have a stable F1 numeric ID across a
  career). `UNIQUE(name, team_name)` — same driver at a different team is a different row.
- **`qualifying_results`** / **`race_results`** — one row per driver per session. UUID PK, FK →
  `sessions` + `drivers`, `UNIQUE(session_id, driver_id)`. Lap times/gaps stored as `TEXT`
  (formatted strings from F1's API, not numeric).
- Relies on Postgres 18's native `uuidv7()` — matches the pinned `postgres:18-alpine` image.

## Data pipeline (`lib/crawler/`)
Fetches from `https://livetiming.formula1.com/static/` (F1's live-timing static API).
- `index.ts <year>` — entrypoint. Reads `<year>/Index.json`, loops meetings, stores GP + drivers +
  qualifying + race (and sprint variants if present). Skips meetings with no qualifying/race
  session (`SessionNotFound`, caught and logged as a warning, not fatal).
- `hydrate_all.ts` — spawns `index.ts` once per year in `AVAILABLE_YEARS`.
- `fetch.ts` — thin fetch wrapper: base URL + 100ms throttle + error logging.
- `service/` — orchestration per concern:
  - `grand_prixs.service.ts` picks the right session paths off F1's raw `Meeting.Sessions`
    (handles sprint vs. sprint-shootout naming differences across seasons).
  - `drivers.service.ts` caches driver upserts in-memory per crawl run (keyed
    `${name}|${team}`) so the same driver isn't inserted twice.
  - `qualifying.service.ts` / `race.service.ts` fetch weather + timing JSON, map into DB rows.
- `repository/` — one per table, all `insert().onConflict([...]).merge().returning('*')`.
- `utils/getGMTOffset.ts` — normalizes F1's GMT-offset string to a `+`/`-` prefixed form.
- `api_types/` — raw shape types for F1's live-timing JSON endpoints (distinct from `types.ts`,
  which holds the DB-row types).

`lib/years.ts` — `AVAILABLE_YEARS = [2018, 2019, 2020, 2021, 2023, 2024, 2025, 2026]` (2022 is
missing; matches what's actually hydrated in Postgres). `lib/mock/season2026.ts` was a
deterministic mock-data generator used only for the early UI draft — dead code, not imported
anywhere, being removed.

## App (`app/`)
- **Grid view** (`app/page.tsx` + `app/components/GPSummary.tsx`) — **implemented and verified
  working** against real hydrated DB data (confirmed live: 22 tiles rendered for 2026 with real
  sponsor names, winners, poles, team colors). Reads via `GPSummaryRepository.get(year)`
  (`app/repository/gp_summary.repository.ts`), which unions race-session and sprint-session rows
  per GP, each joined to its P1 driver for winner/pole.
- **Detail view** (`app/gp/[key]/page.tsx`) — **stub only**, always renders "Detail view coming
  soon" regardless of GP. The repository layer it needs already exists and returns real data:
  `GPDetailsRepository` (`app/repository/gp_details.repository.ts`) has
  `getSprintQualifyingResults`, `getRaceResults`, `getSessionDetails` — this is the main gap
  between the design and the current app.
- `app/types.ts` — `GpSummary`, `GPDetailsQualifyingResults`, `GPDetailsRaceResults`,
  `GPSessionDetails`.

## Design bundle (`f1-data-website-design/`)
Claude Design (claude.ai/design) handoff — HTML/CSS/JS prototypes to recreate pixel-perfectly in
the real stack, not to copy structurally.
- `project/F1 Season.dc.html` — primary design. Grid view (already matches `GPSummary.tsx`,
  "Editorial" style — Newsreader/Inter fonts, cream background, red accent) and **Detail view**
  (not yet built): back link, header with round/kind label + weather box, tabs
  (Qualifying/Race or Sprint Qualifying/Sprint), Q1/Q2/Q3 table, race results table with gap/best
  lap/pits/fastest-lap badge.
- `project/GP Tile Explorations.dc.html` — 3 earlier tile-style explorations (Broadcast/dark,
  Editorial/light, Telemetry/mono); Editorial won.
- `support.js` — generated DC runtime, not project-specific, no need to read closely.

## Known gaps
- GP detail page implementation (see above) — the clear next piece of work.
- `lib/mock/season2026.ts` scheduled for removal (dead code, UI-draft-only).
