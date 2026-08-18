# Dexter — Full Stack Task Management Assessment

A Figma-focused task management application built with Next.js App Router, Tailwind CSS, NestJS, TypeScript and SQLite.

## Included flows

- Guest Login with a NestJS `/auth/guest` endpoint and local session persistence.
- Tasks: Board and List views.
- Fields menu with selectable columns.
- Nested task filters for Status, Priority, Members, Due Date, Teams, Labels and Reporter.
- Task detail panel with editable title/description, status, priority, dates, labels, subtasks, comments and updates.
- Projects page with search, fields, filters, add/edit/delete and responsive table layout.
- Profile page matching the supplied Figma flow.
- Sidebar theme and color controls.
- Light/Dark theme and accent color persist across refreshes.
- Responsive desktop, tablet and mobile layouts.
- NestJS validation using class-validator and clean REST endpoints.

## Run

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

Optional frontend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## API

- `POST /auth/guest`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/comments`
- `POST /tasks/:id/subtasks`
- `GET /projects`
- `POST /projects`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

## Design notes

The implementation follows the supplied Figma references for the Login, Tasks Board, Tasks List, Fields/Filter menus, Task Detail, Projects, Theme/Color menus and Profile flows. Responsive behavior is adapted for smaller screens where the fixed Figma canvas cannot be reproduced literally; horizontal task tables/boards scroll rather than clipping content.

No intentional product-level deviations were made beyond responsive adaptations and using CSS-generated placeholder avatars/branding because the Figma reference does not provide production asset files in this repository.


## Final QA

- Reviewed the requested Figma flows: Guest Login, Tasks Board/List, Fields and Filters, Projects, Sidebar menu, Task Detail, and Profile.
- Removed an extra login-only logo element so the Guest Login composition stays aligned with the reference.
- TypeScript/TSX parser validation completed for all frontend and backend source files with no syntax diagnostics.
- No generated build artifacts or local SQLite database are included in the submission archive.

## Running locally

Start the NestJS API first:

```bash
cd backend
npm install
npm run start:dev
```

Then start Next.js in another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:4000` for the API by default. Set `NEXT_PUBLIC_API_URL` if the API runs elsewhere.

Project/task creation is also guarded against a temporarily unavailable API: the UI keeps the workspace usable with localStorage fallback and automatically uses the NestJS API whenever it is reachable.
