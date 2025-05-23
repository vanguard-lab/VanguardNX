#!/bin/bash
set -e

# Paths for flag and database list files
FLAG_FILE="/cockroach/cockroach-data/.init-done"
DB_LIST_FILE="/cockroach/cockroach-data/.init-databases"

# Wait for CockroachDB to be ready
until /cockroach/cockroach sql --insecure --host=localhost:26257 --execute="SELECT 1;" > /dev/null 2>&1; do
  echo "Waiting for CockroachDB to be ready..."
  sleep 2
done

# Function to get current databases from CockroachDB
get_current_databases() {
  /cockroach/cockroach sql --insecure --host=localhost:26257 --execute="SHOW DATABASES;" | grep -v 'database_name' | grep -v '\-\-\-' | grep -v 'rows)' | awk '{print $1}' | sort | tr '\n' ',' | sed 's/,$//'
}

# Read the last processed database list (if it exists)
if [ -f "$DB_LIST_FILE" ]; then
  LAST_DB_LIST=$(cat "$DB_LIST_FILE")
else
  LAST_DB_LIST=""
fi

# Check if COCKROACH_DATABASES is set and differs from the last processed list
if [ -n "${COCKROACH_DATABASES:-}" ] && [ "$COCKROACH_DATABASES" != "$LAST_DB_LIST" ]; then
  echo "Database list changed or first run (current: $COCKROACH_DATABASES, last: $LAST_DB_LIST). Updating databases..."

  # Convert comma-separated lists to arrays
  IFS=',' read -r -a new_dbs <<< "$COCKROACH_DATABASES"
  IFS=',' read -r -a old_dbs <<< "$LAST_DB_LIST"

  # Create new databases
  for db in "${new_dbs[@]}"; do
    if [[ ! " ${old_dbs[*]} " =~ " $db " ]]; then
      echo "Creating database '$db'"
      /cockroach/cockroach sql --insecure --host=localhost:26257 --execute="CREATE DATABASE IF NOT EXISTS $db;"
    fi
  done

  # Warn about removed databases (optional: uncomment to drop them)
  for db in "${old_dbs[@]}"; do
    if [[ ! " ${new_dbs[*]} " =~ " $db " ]]; then
      echo "Warning: Database '$db' removed from COCKROACH_DATABASES. Not dropping it to avoid data loss."
      # Uncomment below to drop removed databases
      # echo "Dropping database '$db'"
      # /cockroach/cockroach sql --insecure --host=localhost:26257 --execute="DROP DATABASE IF EXISTS $db;"
    fi
  done

  # Update the stored database list
  echo "$COCKROACH_DATABASES" > "$DB_LIST_FILE"
  echo "Updated database list stored in $DB_LIST_FILE"

  # Create or update flag file
  touch "$FLAG_FILE"
  echo "Initialization complete, flag file updated at $FLAG_FILE"
else
  echo "No changes in COCKROACH_DATABASES (current: $COCKROACH_DATABASES), skipping database initialization"
fi