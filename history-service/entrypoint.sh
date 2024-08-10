#!/bin/bash

# Menjalankan migrasi jika diperlukan
npx sequelize db:create --env development || echo "Database sudah ada"
npx sequelize db:migrate --env development || echo "Migrasi sudah dijalankan"

# Menjalankan perintah asli di CMD
exec "$@"