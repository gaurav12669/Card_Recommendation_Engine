#!/bin/sh

set -e

REQUIRED_VARS="DB_HOST DB_USER DB_NAME MONGO_URI REDIS_HOST"

for VAR in $REQUIRED_VARS; do
  VALUE=$(eval echo "\$$VAR")
  if [ -z "$VALUE" ]; then
    echo "Error: Environment variable $VAR is not set."
    exit 1
  fi
done

if [ "$RUN_SETUP_ON_STARTUP" != "false" ]; then
  echo "Running database setup..."
  npm run setup
else
  echo "Skipping database setup (RUN_SETUP_ON_STARTUP=false)."
fi

echo "Starting application..."
exec "$@"

