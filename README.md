Full Stack Developer – Technical Assessment

A full-stack Task Management System developed as part of the Full Stack Developer Technical Assessment.

Part 1 – Task Management System
Live Demo

https://sulekha-psi.vercel.app/

Overview

Dexter is a Figma-focused task management application built with Next.js App Router, Tailwind CSS, NestJS, TypeScript and SQLite.

Features
Guest Login
Task Board and List views
Create, edit and delete tasks
Task detail panel
Status and priority management
Due dates, labels, members, teams and reporters
Nested task filters
Fields/columns selection
Subtasks and comments
Projects search, add, edit and delete
Profile page
Light/Dark theme
Accent color customization
Theme persistence across refreshes
Responsive desktop, tablet and mobile layouts
Reusable components
NestJS REST APIs
Request validation using class-validator
Tech Stack
Frontend: Next.js, React, TypeScript, Tailwind CSS
Backend: NestJS, TypeScript
Database: SQLite
Local Setup

Backend

cd task-management-system/backend
npm install
npm run start:dev

Runs on http://localhost:4000

Frontend

cd task-management-system/frontend
npm install
npm run dev

Runs on http://localhost:3000

Environment Variable
NEXT_PUBLIC_API_URL=http://localhost:4000
API Endpoints
POST   /auth/guest


GET    /tasks
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id


POST   /tasks/:id/comments
POST   /tasks/:id/subtasks


GET    /projects
POST   /projects
PATCH  /projects/:id
DELETE /projects/:id
Design Fidelity

The implementation follows the supplied Figma references for Guest Login, Tasks Board, Tasks List, Fields, Filters, Task Detail, Projects, Theme/Color menus and Profile.

Responsive adaptations were made for smaller screens where the fixed Figma canvas could not be reproduced literally. Horizontal task tables and boards scroll instead of clipping content.

QA & Testing
Reviewed all requested Figma flows.
TypeScript/TSX parser validation completed for frontend and backend source files.
No generated build artifacts or local SQLite database are included.

Part 2 – AbleSpace Product Understanding

The Take Data workflow from the Caseload tab in AbleSpace has been explored and documented.

The complete Part 2 submission, including screenshots, workflow explanation, product understanding and UX/UI or functionality improvement suggestions, is provided in a single PDF.

Documentation

View AbleSpace Walkthrough PDF

Repository Structure
full-stack-developer-assessment/
│
├── README.md
│
├── task-management-system/
│   ├── frontend/
│   ├── backend/
│   └── README.md
│
└── part-2-abespace/
    └── AbleSpace-Walkthrough.pdf
Submission Links

Live Application:
https://sulekha-psi.vercel.app/

GitHub Repository:
[Add your public repository link here.](https://github.com/Sulekha550/Tasks)
