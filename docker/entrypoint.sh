
#!/bin/bash

# Exit on fail
set -e

# Wait for DB (simple sleep for now, could use wait-for-it)
echo "Waiting for database..."
sleep 5

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Clear caches
echo "Clearing caches..."
php artisan optimize:clear

# Execute the passed command (php-fpm)
echo "Starting application..."
exec "$@"
