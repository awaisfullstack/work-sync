# Backend Architecture

The backend follows a feature-first NestJS structure:

```text
src/
  app.module.ts          # Root application composition
  main.ts                # Bootstrap, global pipes, filters, interceptors
  common/                # Cross-cutting framework concerns
    decorators/
    filters/
    guards/
    interceptors/
    types/
  config/                # Runtime, database, and Swagger configuration
  database/              # Sequelize CLI config, migrations, and seeders
  modules/               # Business capabilities grouped by domain
    activity-logs/
    auth/
    dashboard/
    departments/
    projects/
    shifts/
    tasks/
    users/
```

Guidelines:

- Keep controllers, services, DTOs, entities, enums, and specs inside their owning feature module.
- Put reusable Nest primitives in `common`, not inside a feature module.
- Put environment and infrastructure configuration in `config`.
- Put schema-change artifacts and seed data in `database`.
- Prefer explicit relative imports so compiled JavaScript can run without path-alias runtime hooks.
