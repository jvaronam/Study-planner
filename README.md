# Study Planner

Final project for the **Web Programming** course.

A small study planner for students where each user can:

- Sign up and log in.
- Create and manage **subjects**.
- Add **tasks** (exams, assignments, projects, study sessions) to each subject.
- Mark tasks as completed / pending.
- See a dashboard with an overview of their study plan.

## Tech stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Auth.js / NextAuth** (credentials provider)
- **PostgreSQL** (Docker)
- **Prisma** as ORM

---

## Features

### Authentication

- User sign-up at `/signup`.
- Login with email and password at `/login`.
- Passwords are hashed with **bcrypt**.
- Protected routes:
  - `/dashboard`
  - `/subjects`
  - `/subjects/[id]`
- If the user is not authenticated, they are redirected to `/login`.

### Subjects

Each user can manage their own subjects:

- Create new subjects (name, semester, credits, difficulty).
- List their subjects at `/subjects`.
- Delete subjects (and all their tasks).
- Navigate to a subject detail page at `/subjects/[id]`.

### Tasks

For each subject, the user can manage tasks:

- Create tasks with:
  - title (required)
  - description (optional)
  - type (`EXAM`, `ASSIGNMENT`, `PROJECT`, `STUDY`)
  - due date (optional)
  - grade (optional)
- List tasks in the subject detail page.
- Mark tasks as **completed** / **pending**.
- Delete tasks.

### Dashboard

At `/dashboard` the user can see:

- Total number of subjects.
- Total number of pending tasks.
- A list of the next pending tasks (with subject, type and due date).
- Quick links to:
  - manage subjects
  - open a subject to add tasks
- Button to log out.

---

## Database

The database is a local **PostgreSQL** instance running in Docker.

### 1. Start PostgreSQL with Docker

From the project root:

```bash
sudo docker-compose up -d
