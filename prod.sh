if [ ! "$NODE_ENV" = "production" ]
then
echo Cannot run the prod script when the environement is not prod.
exit 1
fi

bun orm:connected migration:run
bun start:prod $*
