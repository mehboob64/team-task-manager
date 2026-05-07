# Team Task Manager

A full-stack team task manager built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, and JWT authentication.

## Ownership

- Owner: onlym
- Repository: https://github.com/mehboob64/team-task-manager.git

## Features

- Signup and login with JWT
- Role-based access for `admin` and `member`
- Admin project creation and member assignment
- Admin task creation and assignment to team members
- Member task status updates
- Dashboard totals for all tasks, completed, pending, and overdue tasks
- REST API with validation, protected routes, and MongoDB relationships
- Railway-ready monorepo deployment

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT and bcrypt
- Deployment: Railway

## Local Setup

1. Install dependencies:

```bash
npm run install-all
```

2. Create server environment variables in `server/.env` using `server/.env.example` as a guide:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

3. Run the backend:

```bash
npm run dev --prefix server
```

4. Run the frontend in another terminal:

```bash
npm run dev --prefix client
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:5000/api`.

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `PATCH /api/users/:id/role` admin only

### Projects

- `GET /api/projects`
- `POST /api/projects` admin only
- `GET /api/projects/:id`
- `PUT /api/projects/:id` admin only
- `DELETE /api/projects/:id` admin only

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/stats`
- `POST /api/tasks` admin only
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id` admin only

## Railway Deployment

1. Push this folder to GitHub.
2. Create a MongoDB Atlas cluster and copy the connection string.
3. Create a new Railway project from the GitHub repository.
4. Set the Railway service root to the repository root. The included `railway.json` uses `npm run build` and `npm start`.
5. Add these Railway environment variables:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-railway-domain.up.railway.app
```

6. Railway should use:

```bash
npm run build
npm start
```

7. Generate a Railway domain and use it as the live URL.

## Submission Checklist

- Live URL: add your Railway URL here
- GitHub repository: add your repository URL here
- README: included
- Demo video: record a 2-5 minute walkthrough showing signup, login, admin project creation, task assignment, member status update, and dashboard stats

## Demo Flow

1. Register the first account. It automatically becomes admin.
2. Register one or more member accounts.
3. Login as admin and create a project.
4. Assign members to the project.
5. Create tasks and assign them to members.
6. Login as a member and update task status.
7. Return to the dashboard to show totals, completed, pending, and overdue tasks.
