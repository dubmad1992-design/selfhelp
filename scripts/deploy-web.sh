#!/usr/bin/env bash
# Export the web build and publish it to fitness.appathy.uk.
set -euo pipefail
cd "$(dirname "$0")/.."
npx expo export --platform web
rsync -a --delete dist/ /var/www/fitness-app/
echo "Deployed to https://fitness.appathy.uk"
