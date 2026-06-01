# TaskFlow: Full-Stack MERN Task Management Application

> A production-structured MERN application featuring JWT-based auth with refresh token rotation, role-based access control, a secure REST API, and a React SPA with protected routing and an Axios interceptor layer.

---

## Table of Contents

- [Overview](#overview)
- [Tools and Technologies](#tools-and-technologies)
- [Project Structure](#project-structure)
- [Methods](#methods)
- [Key Insights](#key-insights)
- [Output](#output)
- [API Documentation](#api-documentation)
- [How to Run This Project](#how-to-run-this-project)
- [Result and Conclusion](#result-and-conclusion)
- [Scalability Note](#scalability-note)
- [Future Work](#future-work)
- [Author and Contact](#author-and-contact)

---

## Overview

TaskFlow is a full-stack task management application built on the MERN stack. It implements a real-world authentication system: **access + refresh token pair**, token rotation on refresh, and server-side token invalidation on logout, paired with **role-based access control** (user vs. admin) enforced at both the API middleware and React routing layers.

Users can register, log in, and manage their own tasks (create, read, update, delete). Admins get a separate dashboard to manage all users and all tasks system-wide. The backend follows a **layered architecture** (routes - controllers - services - models), keeping business logic cleanly separated from transport concerns.

---

## Tools and Technologies

| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server, middleware pipeline |
| **MongoDB + Mongoose** | Document database, schema definition, indexed queries |
| **JWT (jsonwebtoken)** | Access token (15m) + refresh token (7d) issuance and verification |
| **bcrypt** | Password hashing with configurable salt rounds |
| **React 18 + Vite** | Frontend SPA, fast HMR dev server, optimised production build |
| **React Router v6** | Client-side routing, protected and role-gated routes |
| **Axios** | HTTP client with request/response interceptor for silent token refresh |
| **React Context API** | Global auth state: user, access token, refresh token |
| **dotenv** | Environment variable management with startup validation |
| **CORS** | Configured origin whitelist via `CLIENT_URL` env var |

> **Architecture note:** The backend is deliberately kept dependency-light, no Passport, no third-party auth library. Auth is hand-rolled using `jsonwebtoken` + `bcrypt` to demonstrate understanding of the underlying mechanisms rather than reliance on abstractions.

---

## Project Structure

```
task-management-app/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, CORS, env validation, admin seeder
│   │   ├── constants/       # HTTP status codes, messages, enums (roles, status, priority)
│   │   ├── controllers/     # Route handlers: auth, task, admin
│   │   ├── middlewares/     # JWT auth guard, role check, sanitizer, error handler
│   │   ├── models/          # Mongoose schemas: User, Task, RefreshToken
│   │   ├── routes/          # Express routers: /auth, /tasks, /admin
│   │   ├── services/        # Business logic: auth, task, admin, token, user
│   │   ├── utils/           # ApiError, ApiResponse, asyncHandler, sanitize, validate
│   │   ├── validators/      # Input validators per domain (auth, task, admin)
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point: DB connect, seed, listen
│   ├── integration.test.js  # End-to-end integration test (node runner)
│   ├── .env.example         # All required env variables documented
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios instance + auth and admin API modules
    │   ├── components/      # Navbar, TaskForm, TaskList, ProtectedRoute, AdminRoute
    │   ├── context/         # AuthContext: global user/token state
    │   ├── hooks/           # useTasks: task CRUD with loading state
    │   ├── pages/           # Login, Register, Dashboard, AdminDashboard, NotFound, Unauthorized
    │   ├── utils/           # localStorage abstraction, error message normaliser
    │   ├── App.jsx          # BrowserRouter + route declarations
    │   └── styles.css       # Global styles
    ├── index.html
    ├── vite.config.js       # Dev proxy - localhost:5000
    └── package.json
```

---

## Methods

**Dual-Token Auth with Server-Side Invalidation**

On login, the server issues a short-lived **access token (15m)** and a long-lived **refresh token (7d)**, storing the refresh token in MongoDB (`RefreshToken` model). On logout, the token document is deleted, making the refresh token immediately invalid server-side regardless of its remaining TTL.

**Silent Token Refresh via Axios Interceptor**

`axiosInstance.js` registers a response interceptor. On a `401`, it pauses all concurrent in-flight requests in a `failedQueue`, silently calls `/auth/refresh-token`, updates the stored access token, drains the queue with the new token, and retries the original request, entirely transparent to the calling component.

**Role-Based Access Control**

Two Express middlewares chain in sequence on protected admin routes: `auth.middleware` verifies the JWT and attaches `req.user`, then `role.middleware` checks `req.user.role === requiredRole` and throws `403 Forbidden` if it doesn't match. The same gate is replicated on the frontend with `AdminRoute` component wrapping admin pages.

**Service Layer Pattern**

Controllers are thin, they validate input, call a service method, and return an `ApiResponse`. All business logic (duplicate email check, bcrypt comparison, user-scoped task queries) lives in dedicated service files, keeping controllers independently testable.

**Input Sanitization**

`requestSanitizer.middleware` runs on every request before routing. It scans `req.body`, `req.query`, and `req.params` for patterns like `<script>`, `onclick=`, `onerror=`, and `<iframe>`, throwing a `400 ApiError` on match, a lightweight XSS guard at the middleware layer.

**Auto-Seeded Admin Account**

On server startup, `seedAdmin.js` checks for an existing admin user and creates one from env vars if absent. This means the admin account is always available in fresh environments without a manual setup step.

---

## Key Insights

- **Layered separation is enforced throughout:** routes own nothing except middleware chains and controller delegation; controllers own nothing except validation and service calls; services own all business rules. The pattern scales.
- **The Axios interceptor handles the hardest auth edge case**: concurrent requests during a token expiry by queuing them and replaying after a single refresh, preventing a cascade of parallel refresh calls.
- **Env validation runs at startup**, not lazily at runtime. Missing secrets are caught immediately with a clear warning, not surfaced as a cryptic error mid-request in production.
- **`toSafeObject()`** on the User model removes the password hash before any user data leaves the server, a deliberate model-layer guard rather than relying on callers to remember to omit the field.
- **Task model has a compound index on `user`** : queries scoped to a user (`getByUser`) hit the index rather than scanning the collection.

---

## Output

| Feature | Behaviour |
|---|---|
| **Register / Login** | User registers, receives access + refresh token pair; credentials validated and hashed |
| **Protected Dashboard** | Unauthenticated users redirected to `/login`; authenticated users see their own tasks |
| **Task CRUD** | Create tasks with title, description, status (`pending / in-progress / completed`), priority (`low / medium / high`), due date; update and delete scoped to owner |
| **Token Refresh** | Expired access token silently refreshed in the background; user session continues uninterrupted |
| **Admin Dashboard** | Admin-only route; lists all users and all tasks; can create, update, delete any task |
| **RBAC Guard** | Non-admin access to `/admin` routes returns `403 Forbidden` at both API and UI layer |
| **Logout** | Refresh token deleted server-side; subsequent refresh attempts rejected |
| **Integration Test** | `integration.test.js` exercises the full auth + task + admin flow end-to-end against a live server |

---

## API Documentation

Base URL: `http://localhost:5000/api/v1`

All protected routes require: `Authorization: Bearer <accessToken>`

### Auth Routes

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | No | `{ name, email, password }` | Register a new user |
| `POST` | `/auth/login` | No | `{ email, password }` | Login; returns `accessToken`, `refreshToken`, `user` |
| `POST` | `/auth/refresh-token` | No | `{ refreshToken }` | Issue a new access token |
| `POST` | `/auth/logout` | No | `{ refreshToken }` | Invalidate refresh token server-side |
| `GET` | `/auth/me` | | - | Return current authenticated user |

### Task Routes (User-scoped)

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/tasks` | `{ title, description?, status?, priority?, due_date? }` | Create a task |
| `GET` | `/tasks` | List all tasks for the authenticated user |
| `GET` | `/tasks/:id`| Get a single task by ID (owner only) |
| `PUT` | `/tasks/:id`| `{ title?, description?, status?, priority?, due_date? }` | Update a task (owner only) |
| `DELETE` | `/tasks/:id`| Delete a task (owner only) |

### Admin Routes (Admin role only)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/admin/users` | admin | List all registered users |
| `GET` | `/admin/tasks` | admin | List all tasks system-wide |
| `POST` | `/admin/tasks` | admin | `{ user, title, ... }` : Create a task for any user |
| `GET` | `/admin/tasks/:id` | admin | Get any task by ID |
| `PUT` | `/admin/tasks/:id` | admin | Update any task (user reassignment rejected) |
| `DELETE` | `/admin/tasks/:id` | admin | Delete any task |

**Standard response envelope:**
```json
{ "success": true, "message": "...", "data": { ... } }
```

**Error response:**
```json
{ "success": false, "message": "...", "details": null }
```

---

## How to Run This Project

**Prerequisites:** Node.js v18+, MongoDB (local or Atlas), npm

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm install
npm run dev
# Server starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
# Vite proxies /api/* - http://localhost:5000
```

### Run Integration Tests

```bash
# With backend running:
cd backend
node integration.test.js
```

> The seeded admin credentials default to `admin@student.com` / `Admin@12345` (set via `.env`).

### Build for Production

```bash
cd frontend
npm run build   # outputs to frontend/dist/
```

---

## Result and Conclusion

TaskFlow demonstrates full-stack engineering with production-grade patterns applied throughout, not just a working prototype. The project shows understanding of the complete auth lifecycle, layered backend design, and how to keep a React frontend properly decoupled from the API via an abstraction layer.

**Key achievements:**
- JWT dual-token auth with server-side invalidation on logout
- Silent token refresh handling concurrent 401s without redundant refresh calls
- RBAC enforced at middleware level (backend) and route component level (frontend)
- Service layer cleanly separates business logic from Express transport
- Input sanitizer guards against XSS patterns on every incoming request
- Admin auto-seeding on startup, zero manual setup in fresh environments
- End-to-end integration test covering the full user + admin lifecycle

---

## Scalability Note

The current architecture is designed for clarity and correctness at moderate scale. The following are straightforward extension points when scaling becomes a requirement:

- **Stateless auth:** The access token is already stateless (JWT-verified without a DB hit). Switching to a Redis-backed refresh token store (replacing MongoDB `RefreshToken`) would support horizontal scaling across multiple server instances with shared token state.
- **Task indexing:** `task.model.js` already defines `{ user: 1 }` as a MongoDB index, keeping per-user queries fast as the task collection grows. Adding compound indexes (e.g. `{ user: 1, status: 1 }`) for filtered list views is a one-line schema change.
- **Pagination:** The service layer (`getByUser`, `getAllTasks`) currently returns full lists. Adding `limit`/`skip` or cursor-based pagination is an isolated change inside the service files without touching controllers or routes.
- **Environment separation:** `src/config/env.js` validates and centralises all config. Switching from local MongoDB to Atlas, or from a single server to a load-balanced fleet, only requires `.env` changes, no code paths change.

---

## Future Work

- [ ] Add **pagination and filtering** to task list endpoints (by status, priority, due date)
- [ ] Implement **password reset flow** via email token
- [ ] Add **Zod or Joi** schema validation to replace hand-rolled validators for stricter type safety
- [ ] Write **unit tests** for service layer using Jest + mongodb-memory-server
- [ ] Add **rate limiting** (`express-rate-limit`) on auth endpoints to prevent brute-force attacks
- [ ] Deploy backend to **Railway / Render** and frontend to **Vercel** with CI/CD via GitHub Actions
- [ ] Add **task due-date reminders** via a scheduled job (node-cron)

---

## Author and Contact

**Developed by:** Manas Gulati

- **GitHub:** [github.com/ManasGulati](https://github.com/ManasGulati)
- **LinkedIn:** [linkedin.com/in/manasgulatiryu](https://linkedin.com/in/manasgulatiryu)
- **Email:** manasgulati222@gmail.com

---

> Built with Node.js, Express, MongoDB, React 18, Vite, and Axios.
