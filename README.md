# EnglishAm

Admin panel for the legacy English-tutoring site. Django REST backend (auto-CRUD over 183 imported MySQL tables) + React/Vite frontend (composite editor with relation drill-down).

## Quick start (dev)

You need: Docker Desktop, Python 3.11+, Node 20+.

```bash
# 1. Configuration
cp .env.example .env             # tweak if you want; defaults work for local dev

# 2. Database (MySQL in Docker)
docker compose -f docker-compose.dev.yml up -d
# First boot: load the legacy dump (file isn't tracked; place it at the repo root)
docker exec -i eng-mysql sh -c 'exec mysql -uroot -prootpw english' < english_18_01_19_backup.sql

# 3. Backend
python -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python manage.py migrate
DJANGO_SUPERUSER_USERNAME=admin DJANGO_SUPERUSER_EMAIL=admin@example.com \
  DJANGO_SUPERUSER_PASSWORD=admin \
  ./venv/bin/python manage.py createsuperuser --noinput
./venv/bin/python manage.py runserver 8000

# 4. Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Open:
- **React admin** — http://localhost:5173/ (login: admin / admin)
- **Django admin** — http://localhost:8000/admin/
- **DRF browsable API** — http://localhost:8000/api/

## Production deploy (Docker)

Builds gunicorn-served Django + nginx-served React bundle, with MySQL as a service.

```bash
# 1. Secrets
cp .env.example .env
# REQUIRED edits in .env:
#   DJANGO_SECRET_KEY=<run: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'>
#   DJANGO_DEBUG=0
#   DJANGO_ALLOWED_HOSTS=your.domain.com
#   DJANGO_CSRF_TRUSTED_ORIGINS=https://your.domain.com
#   DJANGO_SECURE_PROXY_SSL_HEADER=1   # when behind nginx/caddy with TLS
#   DB_PASSWORD=<something strong>
#   SENTRY_DSN=https://...             # optional but recommended

# 2. Bring up the stack (db + backend + frontend)
docker compose up -d --build

# 3. Bootstrap an admin user (one-time)
docker compose exec backend \
  python manage.py createsuperuser
```

The frontend is on `:8080` by default (`FRONTEND_PORT` in `.env`). Put your TLS terminator (nginx, Caddy, Cloudflare) in front of it.

### Backups

```bash
./scripts/backup-mysql.sh /srv/backups
```

Pairs with a cron entry:
```
15 3 * * * /srv/EnglishAm/scripts/backup-mysql.sh /srv/backups && \
           find /srv/backups -name 'eng-*.sql.gz' -mtime +30 -delete
```

### Restore

```bash
gunzip < /srv/backups/eng-YYYYMMDDTHHMMSSZ.sql.gz | \
  docker compose exec -T db sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

## Architecture

```
┌─────────────────┐   /api/*       ┌──────────────────┐   MySQL  ┌─────────┐
│ frontend (nginx)│ ──────────────▶│ backend (gunicorn)│─────────▶│  db     │
│  React SPA      │                │  Django + DRF     │          │ mysql:8 │
└─────────────────┘                └──────────────────┘          └─────────┘
        ▲                                   ▲
        │ TLS (your terminator)             │
        └───────────────────────────────────┘
```

- **Auth** is session-based (HttpOnly cookies, CSRF via `X-CSRFToken` header). No tokens in localStorage; no `Authorization: Basic` from the SPA.
- **Sensitive columns** (`password`, `auth_key`, anything matching `(^|_)(password|passwd|pwd|secret|token|api_key)(_|$)`) are stripped at the serializer layer — never serialized, never filterable, never orderable.
- **Schema introspection**: 183 viewsets, serializers, and filtersets are generated dynamically at import. MySQL column defaults are read from `information_schema` once and fed into the serializers so legacy NOT-NULL columns don't force every POST to specify them.
- **`/api/sections/`** returns the menu structure derived from `settings.menu_control` + table prefix scanning — nothing about the test sections is hardcoded.
- **`/api/relations/<table>/`** powers the composite editor: every edit page shows the row's own fields plus a tab per child table, recursively.

## Files of interest

- `EnglishAm/settings.py` — env-driven, production-hardened (HTTPS redirect, secure cookies, etc. when `DJANGO_DEBUG=0`)
- `english/api.py` — the auto-CRUD factory (sensitive-field stripping, DB default introspection, lookups, search, ordering)
- `english/auth_views.py` — `/api/auth/{login,logout,whoami}/`
- `english/menu_views.py` — `/api/sections/`, `/api/schema/<table>/`, `/api/relations/<table>/`
- `english/admin.py` — Django admin registration with sensitive-field exclusion
- `frontend/src/api.js` — single fetch wrapper (session cookies, CSRF, 401 broadcast)
- `frontend/src/EditPage.jsx` — composite editor with relation tabs
- `Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf` — production containers
- `docker-compose.yml` — prod stack
- `docker-compose.dev.yml` — dev (DB only, app runs native for hot-reload)
- `.github/workflows/ci.yml` — system check + Django check + frontend build
- `scripts/backup-mysql.sh` — cron-friendly dumper

## Login

Default credentials are `admin / admin`. **Change them on first login** — `docker compose exec backend python manage.py changepassword admin`.

CSRF: the React app reads the `csrftoken` cookie (set by Django on first `/api/auth/whoami/` call) and echoes it as `X-CSRFToken` on every write — handled by `src/api.js`. No manual plumbing.
