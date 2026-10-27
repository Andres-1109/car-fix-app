# GIT_GUIDE.md — FleetCore (car-fix-app)

Remote repository: `https://github.com/Andres-1109/car-fix-app`

---

## One-time repository setup

The project folder is not a git repository yet. Run this once before Stage 1:

```bash
git init -b main
git remote add origin https://github.com/Andres-1109/car-fix-app.git

# Bootstrap main with the planning docs so feature branches have a base
git add INSTRUCTIONS.md STAGES.md .gitignore
git commit -m "docs: add project instructions and stage plan"
git push -u origin main
```

> If the GitHub repository already has commits (e.g. an auto-generated README),
> run `git pull origin main --allow-unrelated-histories` before pushing.

---

## Stage 1 — Project Scaffolding & Configuration

### Branch

```bash
git checkout -b feat/stage-1-project-setup
```

### Commits

```bash
# 1. NestJS scaffold, tooling, and Clean Architecture skeleton
git add package.json package-lock.json nest-cli.json tsconfig.json tsconfig.build.json \
  eslint.config.mjs .prettierrc .gitignore src/modules src/domain-contracts/index.ts \
  src/database src/shared/pipes
git commit -m "chore: scaffold NestJS project with Clean Architecture folder structure"

# 2. TypeORM with migrations: data-source, env validation, npm scripts (synchronize: false)
git add src/config src/app.module.ts
git commit -m "chore: configure TypeORM with migrations, data-source, and npm scripts"

# 3. Docker (container applies migrations on start), global interceptor/filter/pipe, Swagger
git add src/shared src/main.ts Dockerfile docker-compose.yml .dockerignore
git commit -m "chore: configure Docker, environment, and global pipes/filters"

# 4. Environment template (.env itself is git-ignored)
git add .env.example
git commit -m "docs: add .env.example"

# 5. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: add git guide and mark stage 1 complete"
```

### Push

```bash
git push -u origin feat/stage-1-project-setup
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-1-project-setup → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 2 — Domain Contracts & Shared Enums

### Branch

Create it from an up-to-date `main` (after the Stage 1 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-2-domain-contracts
```

### Commits

```bash
git add src/domain-contracts
git commit -m "feat: define shared enums and repository port interfaces"

git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 2 complete"
```

### Push

```bash
git push -u origin feat/stage-2-domain-contracts
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-2-domain-contracts → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 3 — Auth Module (Registration, Login, JWT, Guards, Decorators)

### Branch

Create it from an up-to-date `main` (after the Stage 2 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-3-auth-module
```

### Commits

```bash
# 1. Domain layer
git add src/modules/auth/domain src/domain-contracts
git commit -m "feat: add User domain entity and auth domain exceptions"

# 2. Application layer
git add src/modules/auth/application
git commit -m "feat: implement register and login use cases"

# 3. Infrastructure, decorators, and guards
git add src/modules/auth/infrastructure src/modules/auth/interfaces/decorators \
  src/modules/auth/interfaces/guards
git commit -m "feat: add JWT strategy, guards, and custom decorators"

# 4. Controller, module wiring, global guards
git add src/modules/auth/interfaces/controllers src/modules/auth/auth.module.ts src/app.module.ts
git commit -m "feat: wire auth module with controller endpoints"

# 5. Migration + DB port for running migrations from the host
git add src/database/migrations docker-compose.yml .env.example
git commit -m "chore: add migration for users table"

# 6. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 3 complete"
```

### Push

```bash
git push -u origin feat/stage-3-auth-module
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-3-auth-module → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 4 — Mechanics Module (MECHANIC Users CRUD)

### Branch

Create it from an up-to-date `main` (after the Stage 3 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-4-mechanics-module
```

### Commits

```bash
# 1. Shared password-hasher port and email transformer (small refactor used by auth and mechanics)
git add src/domain-contracts src/shared/transformers src/modules/auth
git commit -m "refactor: move password hasher port to domain-contracts and share email normalizer"

# 2. Mechanics use cases, DTOs, and domain exceptions
git add src/modules/mechanics/domain src/modules/mechanics/application
git commit -m "feat: add mechanics module with CRUD use cases"

# 3. Controller and module wiring
git add src/modules/mechanics/interfaces src/modules/mechanics/mechanics.module.ts src/app.module.ts
git commit -m "feat: add mechanics controller and DTOs"

# 4. Stage tracking (no migration: mechanics reuse the users table)
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 4 complete"
```

### Push

```bash
git push -u origin feat/stage-4-mechanics-module
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-4-mechanics-module → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 5 — Vehicles Module

### Branch

Create it from an up-to-date `main` (after the Stage 4 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-5-vehicles-module
```

### Commits

```bash
# 1. Domain entity and exceptions
git add src/modules/vehicles/domain
git commit -m "feat: add vehicle domain entity and exceptions"

# 2. Use cases, DTOs, ORM entity, repository (+ shared Postgres error helper used by auth too)
git add src/modules/vehicles/application src/modules/vehicles/infrastructure \
  src/shared/persistence src/modules/auth/infrastructure
git commit -m "feat: implement vehicle CRUD use cases and repository"

# 3. Controller and module wiring
git add src/modules/vehicles/interfaces src/modules/vehicles/vehicles.module.ts src/app.module.ts
git commit -m "feat: add vehicles controller with validation"

# 4. Migration
git add src/database/migrations
git commit -m "chore: add migration for vehicles table"

# 5. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 5 complete"
```

### Push

```bash
git push -u origin feat/stage-5-vehicles-module
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-5-vehicles-module → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 6 — Workshops Module

### Branch

Create it from an up-to-date `main` (after the Stage 5 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-6-workshops-module
```

### Commits

```bash
# 1. Full module: domain, use cases, persistence, controller, wiring
git add src/modules/workshops src/app.module.ts
git commit -m "feat: add workshops module with full CRUD"

# 2. Migration
git add src/database/migrations
git commit -m "chore: add migration for workshops table"

# 3. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 6 complete"
```

### Push

```bash
git push -u origin feat/stage-6-workshops-module
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-6-workshops-module → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 7 — Maintenances Module (Core Business Logic)

### Branch

Create it from an up-to-date `main` (after the Stage 6 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-7-maintenances-module
```

### Commits

```bash
M=src/modules/maintenances
UC=$M/application/use-cases

# 1. Domain: entity, schedule range, state machine, exceptions (+ refined port contract)
git add $M/domain src/domain-contracts/ports/maintenance-repository.port.ts
git commit -m "feat: add maintenance domain entities, state machine, and exceptions"

# 2. Create use case with overlap validation
git add $M/application/dtos/create-maintenance.dto.ts $UC/create-maintenance.use-case.ts
git commit -m "feat: implement create-maintenance use case with overlap validation"

# 3. Status update use case + transactional repository (+ shared exclusion-violation helper)
git add $M/application/dtos/update-maintenance-status.dto.ts $UC/update-maintenance-status.use-case.ts \
  $M/infrastructure src/shared/persistence/postgres-errors.ts
git commit -m "feat: implement update-maintenance-status use case with transactions"

# 4. Query use cases
git add $M/application/dtos/list-maintenances-query.dto.ts $UC/find-all-maintenances.use-case.ts \
  $UC/find-active-maintenances.use-case.ts $UC/find-maintenances-by-vehicle.use-case.ts \
  $UC/find-maintenances-by-mechanic.use-case.ts
git commit -m "feat: add maintenance query use cases (active, by vehicle, by mechanic)"

# 5. External history endpoint
git add $M/application/dtos/vehicle-history.dto.ts $UC/find-vehicle-history.use-case.ts \
  $M/interfaces/controllers/vehicle-history.controller.ts
git commit -m "feat: add vehicle history endpoint with x-api-key guard"

# 6. Controller and module wiring
git add $M/interfaces/controllers/maintenances.controller.ts $M/maintenances.module.ts \
  $M/application/ports src/app.module.ts
git commit -m "feat: wire maintenances module and controller"

# 7. Migration (includes btree_gist extension for the schedule exclusion constraint)
git add src/database/migrations
git commit -m "chore: add migration for maintenances table"

# 8. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 7 complete"
```

### Push

```bash
git push -u origin feat/stage-7-maintenances-module
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-7-maintenances-module → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 8 — Seeders

### Branch

Create it from an up-to-date `main` (after the Stage 7 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-8-seeders
```

### Commits

```bash
# 1. Seeder, seed data, and npm scripts (seed, seed:prod)
git add src/database/seeders package.json
git commit -m "feat: add database seeder with idempotent execution"

# 2. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 8 complete"
```

### Push

```bash
git push -u origin feat/stage-8-seeders
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-8-seeders → main), merge it, then:
git checkout main
git pull origin main
```

---

## Stage 9 — Swagger Documentation

### Branch

Create it from an up-to-date `main` (after the Stage 8 PR is merged):

```bash
git checkout main
git pull origin main
git checkout -b feat/stage-9-swagger-docs
```

### Commits

```bash
# 1. Shared Swagger helpers, response DTOs, and decorators on every controller and DTO
git add src/shared/swagger src/modules src/main.ts
git commit -m "docs: add Swagger decorators to all controllers and DTOs"

# 2. Stage tracking
git add STAGES.md GIT_GUIDE.md
git commit -m "docs: update git guide and mark stage 9 complete"
```

### Push

```bash
git push -u origin feat/stage-9-swagger-docs
```

### Merge to main

```bash
# Create a PR on GitHub (feat/stage-9-swagger-docs → main), merge it, then:
git checkout main
git pull origin main
```

