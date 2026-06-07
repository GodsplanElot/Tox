# ToxicReels Agent Operating Guide

This file instructs local coding agents, including Ollama, GPT-OSS, and other local models, on how to work inside this repository. Follow it as the project-level standard for analysis, implementation, review, and communication.

## 1. Operating Mindset

Act like a careful senior engineer working in a real product codebase.

- Read the existing code before proposing or changing anything.
- Prefer the current project patterns over new abstractions.
- Keep changes scoped to the user request.
- Do not rewrite large areas unless the request requires it.
- Make behavior correct first, then polish the implementation.
- Treat frontend, backend, deployment, and env changes as connected systems.
- Never expose secrets from `.env` files, logs, credentials, or cloud consoles.
- When uncertain, inspect the repo before asking the user.

## 2. Standard Workflow

Use this sequence for most tasks:

1. Inspect current state.
   - Run `git status -sb`.
   - Check the current branch.
   - Read the relevant files before editing.
   - Search with `rg` when available; otherwise use PowerShell search.

2. Understand the request.
   - Identify the user-facing behavior.
   - Identify backend/API/data implications.
   - Identify frontend/UI implications.
   - Identify migration, env, deployment, or security impact.

3. Plan internally before editing.
   - Choose the smallest safe implementation.
   - Reuse existing components, services, models, serializers, and CSS patterns.
   - Avoid adding dependencies unless there is a clear advantage.

4. Implement carefully.
   - Make focused edits.
   - Keep naming explicit and consistent.
   - Prefer typed interfaces in frontend code.
   - Prefer Django framework features over custom plumbing.

5. Verify.
   - Backend: run `python manage.py check`.
   - Backend migrations: run `python manage.py makemigrations --check --dry-run` when model fields change.
   - Backend tests: run the smallest relevant `python manage.py test ...` command.
   - Frontend: run `npm.cmd run build` and `npm.cmd run lint` for UI changes.

6. Commit cleanly when requested or when the project convention requires it.
   - Use focused micro-commits.
   - Do not commit ignored local files, real `.env` files, databases, or build artifacts unless explicitly intended.
   - Confirm `git status -sb` after committing.

## 3. Repository Shape

The project has two main application areas:

- `backend/`: Django API, admin, auth, content models, migrations, deployment settings.
- `frontend/`: Vite React app, routes, pages, shared components, API service, CSS.

Important supporting files:

- `docker-compose.yml`: local infrastructure.
- `docker-compose.prod.yml`: Lightsail production deployment.
- `backend/.env.develop.example`: local backend env guidance.
- `backend/.env.production.example`: production backend env guidance.
- `frontend/.env.example`: local frontend env guidance.
- `frontend/.env.production.example`: production frontend env guidance.

## 4. Backend Standards

Use Django conventions first.

- Keep model changes paired with migrations.
- Keep serializer fields aligned with model/API changes.
- Keep admin changes consistent with role permissions and content status workflows.
- Do not require authentication for public browsing pages unless the user explicitly asks.
- Watchlist and profile features must gracefully handle unauthenticated users.
- For file/media storage:
  - Local development should not require S3.
  - Production should use S3 when `USE_S3=true`.
  - MinIO is local-only and must not leak into production config.
- For security:
  - `SECRET_KEY`, cloud keys, OAuth secrets, Resend keys, and database passwords must come from env.
  - Never hardcode production secrets.
  - Production must run with `DJANGO_DEBUG=false`.

Common backend verification:

```powershell
cd backend
python manage.py check
python manage.py showmigrations
python manage.py makemigrations --check --dry-run
python manage.py test apps.users apps.watchlist
```

## 5. Frontend Standards

Build mobile-first, polished, and consistent with the ToxicReels visual system.

- Use existing React patterns: pages under `src/pages`, shared UI under `src/components`, API calls through `src/services/api.ts`.
- Keep TypeScript types aligned with backend serializers.
- Prefer reusable components when behavior appears in more than one page.
- Keep CSS responsive with stable dimensions, no overlapping text, and no layout shift.
- Use existing theme variables such as `--accent-primary`, `--bg-surface`, `--bg-app`, `--text-muted`, and `--font-display`.
- Use icons from the existing icon stack instead of hand-drawn SVG when possible.
- For modals, follow the existing React Bootstrap approach used by `AuthModal`.
- External scripts, ad keys, OAuth client IDs, and API URLs must use Vite env variables.

Common frontend verification:

```powershell
cd frontend
npm.cmd run build
npm.cmd run lint
```

## 6. UI Quality Bar

Frontend work must feel intentional, not generic.

- Prioritize mobile layout first, then desktop.
- Avoid oversized marketing sections for app workflows.
- Use compact, readable controls.
- Do not let long titles, usernames, route labels, or buttons overflow.
- Avoid repeated one-color palettes.
- Keep cards to real repeated items, modals, and tool panels.
- Do not place cards inside cards.
- Avoid decorative clutter that does not help the user.
- For download, auth, admin, and content workflows, make states obvious: loading, empty, disabled, success, error.

## 7. Code Review Standard

When reviewing code, report risks before summaries.

Look for:

- Broken data flow between backend serializers and frontend types.
- Missing migrations after model changes.
- API endpoints that require auth when public pages need access.
- CORS/CSRF mistakes affecting Vercel frontend and Lightsail backend.
- Production settings that still reference localhost, SQLite, MinIO, or `DEBUG=true`.
- Upload paths that fail with S3.
- Mobile UI overflow or hidden controls.
- Inconsistent role permissions for admins, editors, and workers.
- Tests that should be updated but were not.

Review format:

1. Findings by severity with file references.
2. Open questions or assumptions.
3. Brief summary only after issues.

## 8. Git And Branch Discipline

Protect the user’s work.

- Do not discard changes you did not make.
- Do not run `git reset --hard` unless explicitly requested.
- Do not force-push unless explicitly requested.
- Before switching branches, check for uncommitted work.
- Merge feature branches into `develop` unless the user explicitly targets `main`.
- Keep `main` aligned with production-ready code.
- Keep `develop` usable for local development.
- Use micro-commits with clear messages:
  - `Add download redirect ad modal`
  - `Fix local backend env defaults`
  - `Style mobile auth drawer`

## 9. Deployment Awareness

The intended production shape is:

- Frontend: static React app on Vercel at `https://toxicreels.com`.
- Backend: Django API on AWS Lightsail at `https://api.toxicreels.com`.
- Backend runtime: Gunicorn behind Nginx.
- Database: PostgreSQL in Docker Compose on Lightsail for MVP.
- Media: AWS S3 in production.
- DNS/CDN: Cloudflare in front of `api.toxicreels.com`.

Before production-facing changes, check:

- `DJANGO_ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`
- `SECURE_SSL_REDIRECT`
- `SESSION_COOKIE_SECURE`
- `CSRF_COOKIE_SECURE`
- `USE_S3`
- `AWS_S3_ENDPOINT_URL`
- `FRONTEND_URL`
- Vercel frontend env values

## 10. Communication Standard

Be direct and practical.

- State what you are checking and why.
- Give concise progress updates during longer work.
- Explain blockers with exact commands or files.
- Final responses should say what changed, what passed, and what remains.
- Do not bury important warnings.
- Do not paste secrets.

## 11. When To Ask The User

Ask only when the answer cannot be discovered safely from the repo.

Ask for:

- Product choices with real tradeoffs.
- Missing third-party credentials or snippets.
- Whether to push, deploy, delete remote branches, or rotate secrets.
- Whether to use a paid service or change infrastructure.

Do not ask for:

- File locations discoverable from the repo.
- Current branch or migration state.
- Existing package choices.
- Whether to run normal checks after editing.

## 12. Definition Of Done

A task is done when:

- The requested behavior is implemented.
- Relevant checks pass or failures are clearly explained.
- Migrations are created/applied when needed.
- Env examples are updated when new env values are required.
- Git status is clean or intentionally explained.
- The final response tells the user exactly what changed and how to verify it.
