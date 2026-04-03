#!/bin/bash
# scripts/backup.sh
# Cron sugerido: 0 2 * * * /opt/sisdep/scripts/backup.sh

set -e

BACKUP_DIR="/opt/sisdep/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/sisdep_$DATE.sql.gz"

mkdir -p "$BACKUP_DIR"

docker exec sisdep_postgres_prod pg_dump \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  | gzip > "$FILE"

echo "✅ Backup: $FILE"

# Eliminar backups de más de 30 días
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
echo "🗑️  Backups viejos eliminados"
