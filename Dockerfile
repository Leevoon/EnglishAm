# Backend image: gunicorn-served Django, no native MySQL client needed.
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# System deps: tini for proper signal handling, curl for healthchecks.
RUN apt-get update \
 && apt-get install -y --no-install-recommends tini curl \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

# App code. .dockerignore keeps venv, node_modules, .git out.
COPY . .

# Collect static for whitenoise. Tolerate failure during build (DB may not
# be reachable yet); collectstatic itself doesn't need DB.
RUN python manage.py collectstatic --noinput --clear

# Non-root user.
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

EXPOSE 8000
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["gunicorn", "EnglishAm.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
