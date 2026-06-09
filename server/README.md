# WorkSync Backend

NestJS API for WorkSync, a team task, project, shift, department, user, dashboard, and activity-log management system.

## Tech Stack

- NestJS
- PostgreSQL
- Sequelize / sequelize-typescript
- Sequelize CLI migrations and seeders
- JWT authentication with an `access_token` HTTP-only cookie
- Swagger API documentation

## Environment Setup

1. Install dependencies:

```bash
npm install
```

2. Create a PostgreSQL database.

3. Copy the environment example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Update `.env`:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=worksync

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## Run the App

Development:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

Default local API URL:

```txt
http://localhost:4000/api/v1
```

## Migration Commands

Run all pending migrations:

```bash
npm run migration:run
```

Create a new migration:

```bash
npm run migration:create -- migration-name
```

Undo the last migration:

```bash
npm run migration:undo
```

Undo all migrations:

```bash
npm run migration:undo:all
```

Current migrations create:

- PostgreSQL `pgcrypto` extension
- departments
- users
- projects
- project members
- task statuses
- tasks
- task assignments
- task comments
- shifts
- activity logs

## Seeder Commands

Run all seeders:

```bash
npm run seed:run
```

Create a new seeder:

```bash
npm run seed:create -- seeder-name
```

Undo all seeders:

```bash
npm run seed:undo
```

Seeder order:

1. departments
2. users
3. projects
4. project members
5. task statuses
6. tasks
7. task assignments
8. task comments
9. shifts
10. activity logs

Recommended fresh database setup:

```bash
npm run migration:run
npm run seed:run
```

## API Documentation

Swagger is available after starting the server:

```txt
http://localhost:4000/api/docs
```

All application endpoints use the global prefix:

```txt
/api/v1
```

Authentication uses an HTTP-only cookie named:

```txt
access_token
```

Login sets the cookie automatically.

## Main API Routes

### Auth

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/login` | Public | Login user and set auth cookie |
| POST | `/api/v1/auth/logout` | Authenticated | Clear auth cookie |
| GET | `/api/v1/auth/me` | Authenticated | Get current user profile |
| POST | `/api/v1/auth/register` | Admin | Create user through auth flow |

### Users

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/users` | Admin | List users |
| POST | `/api/v1/users` | Admin | Create user |
| GET | `/api/v1/users/stats` | Admin | Get user statistics |
| GET | `/api/v1/users/options` | Admin | Get users for selects/options |
| GET | `/api/v1/users/:id` | Admin | Get one user |
| PATCH | `/api/v1/users/:id` | Admin | Update user |
| PATCH | `/api/v1/users/:id/activate` | Admin | Activate user |
| PATCH | `/api/v1/users/:id/deactivate` | Admin | Deactivate user |
| DELETE | `/api/v1/users/:id` | Admin | Delete user |

### Departments

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/departments` | Admin | List departments |
| POST | `/api/v1/departments` | Admin | Create department |
| GET | `/api/v1/departments/:id` | Admin | Get one department |
| PATCH | `/api/v1/departments/:id` | Admin | Update department |
| DELETE | `/api/v1/departments/:id` | Admin | Delete department |

### Projects

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/projects` | Admin, Employee | List accessible projects |
| POST | `/api/v1/projects` | Admin | Create project |
| GET | `/api/v1/projects/options` | Authenticated | Get projects for selects/options |
| GET | `/api/v1/projects/:id` | Authenticated | Get project details |
| PATCH | `/api/v1/projects/:id` | Admin | Update project |
| PATCH | `/api/v1/projects/:id/archive` | Admin | Archive project |
| GET | `/api/v1/projects/:id/members` | Admin | List project members |
| POST | `/api/v1/projects/:id/members` | Admin | Add project member |
| DELETE | `/api/v1/projects/:id/members/:userId` | Admin | Remove project member |

### Tasks

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/tasks` | Authenticated | List accessible tasks |
| POST | `/api/v1/tasks` | Admin | Create task |
| GET | `/api/v1/tasks/:id` | Authenticated | Get task details |
| PATCH | `/api/v1/tasks/:id` | Admin | Update task |
| PATCH | `/api/v1/tasks/:id/status` | Authenticated | Update task status |
| POST | `/api/v1/tasks/:id/assign` | Admin | Assign task |
| PATCH | `/api/v1/tasks/:id/unassign/:userId` | Admin | Unassign user |
| GET | `/api/v1/tasks/:id/comments` | Authenticated | List task comments |
| POST | `/api/v1/tasks/:id/comments` | Authenticated | Add task comment |
| DELETE | `/api/v1/tasks/:id/comments/:commentId` | Authenticated | Delete task comment |
| DELETE | `/api/v1/tasks/:id` | Admin | Delete task |

### Shifts

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/shifts/clock-in` | Employee | Clock in |
| POST | `/api/v1/shifts/clock-out` | Employee | Clock out |
| GET | `/api/v1/shifts/me` | Admin, Employee | Get current user's shifts |
| GET | `/api/v1/shifts/me/active` | Employee | Get active shift |
| GET | `/api/v1/shifts/me/weekly-hours` | Employee | Get weekly hours |
| GET | `/api/v1/shifts/me/worked-hours` | Employee | Get own worked hours |
| POST | `/api/v1/shifts/manual` | Admin | Create manual shift |
| GET | `/api/v1/shifts/worked-hours` | Admin | Get worked hours for all employees |
| GET | `/api/v1/shifts/user/:userId/worked-hours` | Admin | Get one employee's worked hours |
| GET | `/api/v1/shifts/:id` | Admin | Get shift details |

### Dashboard and Activity Logs

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/dashboard` | Authenticated | Get dashboard data for current user |
| GET | `/api/v1/activity-logs` | Admin, Employee | List activity logs visible to current user |

## Useful Commands

```bash
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```
