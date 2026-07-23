# School Report App — Design Spec

## Overview

A school reporting system where students and teachers can report issues, admins confirm and assign reports to teacher teams, and teams resolve them. Built with Laravel 13 + Inertia v3 + React 19 + Tailwind CSS v4 + Firebase push notifications.

## Roles

| Role | Can report | Can be on team | Can confirm/assign | Can manage teams |
|------|-----------|----------------|-------------------|-----------------|
| Student | Yes | No | No | No |
| Teacher | Yes | Yes | No | No |
| Admin | No (by default) | No | Yes | Yes |

- Default role on registration: `student`
- Admin can change any user's role

## Data Model

### Users (extended)
- Add `role` enum column: `student`, `teacher`, `admin` (default `student`)
- Admin can change role via management UI

### Teams
- `id`, `name`, `description`, `timestamps`
- Simple, no nesting

### Team User (pivot)
- `team_id`, `user_id`
- Only teachers can be added to teams (enforced in app logic)
- A teacher can be on multiple teams

### Reports
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | |
| `user_id` | FK→users | Reporter |
| `team_id` | FK→teams, nullable | Assigned by admin |
| `title` | string | |
| `description` | text | |
| `location` | string | |
| `priority` | enum | `low`, `medium`, `high`, `critical` |
| `status` | enum | `pending`, `confirmed`, `in_progress`, `resolved` |
| `confirmed_at` | timestamp, nullable | |
| `resolved_at` | timestamp, nullable | |
| `timestamps` | | |

### Report Images
- `id`, `report_id` (FK), `path` (string), `created_at`
- Multiple images per report allowed

### Report Logs
- `id`, `report_id` (FK), `user_id` (FK), `action` (string), `description` (nullable text), `created_at`
- Actions: `created`, `confirmed`, `assigned`, `in_progress`, `resolved`, `comment`

### Device Tokens
- `id`, `user_id` (FK), `token` (string), `created_at`
- Stores Firebase device tokens for push notifications

## Report Lifecycle

```
pending → confirmed → in_progress → resolved
```

1. **Student/Teacher submits** → status: `pending`
2. **Admin confirms** → status: `confirmed`, notify reporter
3. **Admin assigns to team** → status: `in_progress`, notify team members
4. **Team marks resolved** → status: `resolved`, notify reporter

## Pages & Views

### Auth
- Login page (email + password)
- Register page (name, email, password; role defaults to student)

### Reporter Pages (Student/Teacher)
- **Submit Report** — form: title, description, location, priority, image upload (multiple)
- **My Reports** — table of user's reports with status badges, clickable
- **Report Detail** — full report info + activity log timeline

### Team Pages (Teachers on a team)
- **Team Dashboard** — stats: assigned count, in-progress count, resolved today, latest 5 reports
- **Team Reports** — table: title, priority, assigned team members, actions (mark in_progress, mark resolved)

### Admin Pages
- **Admin Dashboard** — stats: pending count, confirmed (unassigned), resolved today, total reports
- **All Reports** — table with filters (status, priority, team). Actions: confirm, assign to team
- **Manage Teams** — CRUD teams, manage membership (add/remove teachers)
- **Manage Users** — list users, change roles

### Layout
- Sidebar navigation that adapts by role
- Unified base layout for all authenticated pages

## Notifications (Firebase)

- **New report submitted** → push to all admins
- **Report confirmed** → push to reporter
- **Report assigned** → push to all team members
- **Report resolved** → push to reporter
- Also stored in Laravel's `notifications` table for in-app history

## Technology Stack

- **Backend:** Laravel 13, PHP 8.5
- **Frontend:** React 19 + Inertia v3 + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (dev), production-ready for any DB
- **Push:** Firebase Cloud Messaging via `kreait/laravel-firebase`
- **Auth:** Laravel Breeze-style scaffolding (custom)
- **File Storage:** Laravel Filesystem (local for dev)
