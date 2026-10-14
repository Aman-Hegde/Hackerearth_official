# Project Doomsday showcase

The showcase uses the existing MongoDB `Event` model and public `GET /api/events` response. No database writes occur on startup or while viewing Events.

## Setup

1. Add the missing `frontend/public/events/project-doomsday/doomsday-01.webp`. The seven available images (02–08) were copied from `frontend/public/event/` without changing the originals.
2. Start the frontend and backend with the existing MongoDB configuration.
3. Sign in as an active, verified administrator. In **Admin dashboard → Manage Events**, select **Import Project Doomsday**. This calls `POST /api/admin/events/import/project-doomsday` behind the existing authentication and current-account admin authorization middleware.
4. Confirm the event appears publicly in Past Events. Its start is `2026-10-10T03:30:00.000Z`, displayed as 10 October 2026, 9:00 AM IST regardless of the viewer's timezone.

The import checks for an existing Project Doomsday title or its stable record ID and leaves existing data untouched. The stable MongoDB `_id` prevents simultaneous import requests from inserting two records. If a record already exists, use **Edit** to enter the provided tagline, description, rounds, and the eight image paths; the import deliberately does not overwrite it.

The imported event has registrations disabled. Its venue is internally `Not specified`, its legacy required registration capacity is 1, and its registration deadline equals its start. These compatibility values are not shown in the public past-event showcase and do not represent attendance. No end time was supplied, so none is invented.

## Management

Event editing supports a tagline, ordered photograph URLs (one per line), and rounds. Empty photograph lists retain legacy single-poster behavior. Use the existing image upload to obtain a hosted URL, then add it to the photograph list; remove a line to remove a photograph from the gallery. Uploading, importing, editing, and publication changes all remain admin-only. No public write or deletion route was added.

The **Published publicly** checkbox controls publication/archive independently of the existing registration-active switch. Archived records are excluded from public event lists and cannot accept registrations. Legacy records without this field remain visible. Administrators can edit past-event galleries without inventing an end time.

The shared carousel rotates every 4.5 seconds, pauses on hover/focus, has manual previous/next and pause/play controls, and disables autoplay and fades for reduced motion. One photograph has no slideshow controls. Failed images are skipped; if all fail, event text remains visible with an unavailable message.

No database import, commit, push, or deployment was performed during implementation.

## Changed files for this task

- `backend/src/models/Event.ts`: optional gallery, tagline, rounds, and publication fields.
- `backend/src/controllers/eventController.ts`: gallery validation/serialization, past-event editing, publication filtering, registration guard, and non-overwriting import.
- `backend/src/routes/admin.ts`: protected import route.
- `backend/tests/eventPermissions.test.cjs`: import, gallery, publication, and permission regression coverage.
- `backend/PROJECT_DOOMSDAY.md`: setup and implementation notes.
- `frontend/src/components/EventCarousel.tsx`: shared responsive photo showcase.
- `frontend/src/pages/Events.tsx`: shared carousel in Upcoming and Past Events; past cards omit venue and registration UI.
- `frontend/src/pages/AdminDashboard.tsx`: import action and gallery/publication editing.
- `frontend/src/lib/eventApi.ts`: event fields and authenticated import request.
- `frontend/tests/eventCarousel.test.cjs`: mounted React component tests with controlled timers and motion preference.
- `frontend/package.json`, `frontend/package-lock.json`: matching React test renderer and `test:events` script.
- `frontend/public/events/project-doomsday/doomsday-02.webp` through `doomsday-08.webp`: copies of existing photographs.

## Validation

- Backend TypeScript build passed.
- Backend event permission/registration suite: 20 tests passed, including the suite test.
- `npm --prefix frontend run test:events`: 4 tests passed (static photo, eight-image loop/stationary overlay/pause/cleanup, reduced motion, failed-image fallback).
- Frontend production build passed (existing bundle-size and Browserslist notices).
- Targeted ESLint on the carousel, Events page, and event API passed.
- Full frontend lint and TypeScript checks remain blocked by existing issues, including unused `BookOpen`/`eventSubmitLabel` in AdminDashboard and errors in CodingEnvironment, About, Achievements, resourcesData, and ForgotPassword. Unrelated code was left untouched.
- `git diff --check` passed. No browser visual review or live database import was performed.
