#!/usr/bin/env bash
# Stream a mysqldump out of the running `db` service to a timestamped .sql.gz.
# Intended for cron — fails fast (set -euo pipefail) so failures get reported.
#
# Example crontab entry (runs daily at 03:15, keeps 30 days locally):
#   15 3 * * * /srv/EnglishAm/scripts/backup-mysql.sh /srv/backups && \
#              find /srv/backups -name 'eng-*.sql.gz' -mtime +30 -delete

set -euo pipefail

DEST="${1:-./backups}"
mkdir -p "$DEST"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="$DEST/eng-$STAMP.sql.gz"

# Expects to be run on the host where docker-compose is up.
docker compose exec -T db \
    sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers "$MYSQL_DATABASE"' \
  | gzip > "$OUT"

echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
