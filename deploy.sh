#!/bin/bash
set -euo pipefail

echo "=== Deploiement Bethel Kitchen ==="

# 1. Build le frontend
echo "-> Build React..."
npm run build

# 2. Installer les dependances Laravel
echo "-> Composer install..."
cd laravel
composer install --no-dev --optimize-autoloader

# 3. Caches Laravel
echo "-> Optimisation Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan filament:cache

# 4. Migrations
echo "-> Migrations..."
php artisan migrate --force

# 5. Storage link deja cree
echo "-> OK"

echo "=== Deploiement termine ==="
echo "-> Pointez votre serveur web vers: $(pwd)/public"
echo "-> Ou lancer: php artisan serve --host=0.0.0.0 --port=8000"