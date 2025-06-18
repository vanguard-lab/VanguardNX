#!/bin/bash
set -e

# Start CockroachDB in the background
/cockroach/cockroach start-single-node --insecure --listen-addr=0.0.0.0 &

# Wait for CockroachDB to be ready
until /cockroach/cockroach sql --insecure --host=localhost:26257 -e "SELECT 1" >/dev/null 2>&1; do
  echo "Waiting for CockroachDB to be ready..."
  sleep 2
done

# Check if COCKROACH_DBS is set and not empty
if [ -n "$COCKROACH_DBS" ]; then
  echo "Creating databases from COCKROACH_DBS: $COCKROACH_DBS"
  # Split comma-separated values into an array
  IFS=',' read -ra DB_ARRAY <<< "$COCKROACH_DBS"
  for db in "${DB_ARRAY[@]}"; do
    # Trim whitespace and create database if not empty
    db=$(echo "$db" | tr -d '[:space:]')
    if [ -n "$db" ]; then
      echo "Creating database: $db"
      /cockroach/cockroach sql --insecure --host=localhost:26257 -e "CREATE DATABASE IF NOT EXISTS \"$db\";"
    fi
  done
else
  echo "No databases specified in COCKROACH_DBS."
fi

# Keep container running
wait