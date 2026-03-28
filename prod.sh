#!/usr/bin/sh

if [ ! "$NODE_ENV" = "production" ]
then
echo Cannot run the prod script when the environement is not prod.
exit 1
fi

echo "Launching migrations..."
bun orm:connected migration:run
echo "Database's structure is up-to-date. Starting the api..."
bun start:prod $*
