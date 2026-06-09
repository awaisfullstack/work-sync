# WorkSync Frontend

Next.js frontend for WorkSync. It connects to the NestJS backend and provides dashboards for admins and employees to manage projects, tasks, shifts, users, departments, and activity logs.

## Tech Stack

- Next.js
- React
- Redux Toolkit Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn-style UI components

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy the environment example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Start the backend first. The frontend expects the backend API to be available at the URL in `NEXT_PUBLIC_API_URL`.

4. Start the frontend:

```bash
npm run dev
```

Default local frontend URL:

```txt
http://localhost:3000
```

## Environment Variables

Create `.env` in the `client` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL used by RTK Query and server-side fetch helpers |

## Build Instructions

Create a production build:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

Run lint:

```bash
npm run lint
```

## Authentication Notes

The backend stores the JWT in an HTTP-only cookie named `access_token`.

Frontend API requests use:

```ts
credentials: "include"
```

That allows the browser to send the auth cookie with requests to the backend.

## Project Structure

```txt
app/                 Next.js app routes
components/          Shared UI and layout components
features/            Feature modules such as auth, users, tasks, projects
lib/api/             API base query and server fetch helpers
lib/logger/          Frontend logging helpers
store/               Redux store setup
```

## Local Frontend Logs

The app can send frontend errors to:

```txt
/api/logs
```

Those logs are stored by the Next.js API route in:

```txt
storage/logs/frontend-logs.jsonl
```

This is useful for local debugging. For production, use a database or external logging provider.
