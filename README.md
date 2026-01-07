# API Fyn

## Requierement

The API uses a Postgres driver for the database, so you must have a running postgres to develop the API.

If you want you can use a docker container to do this:

```sh
docker run -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 postgres
```

## Launch the project

If this is the first time you launch the project, you need to configure environnement variables and install dependencies

```sh
# If needed, replace `bun` by your package manager
bun install

cp .env{.example,}
```

Then edit the `.env` file to correspond to your configuration.

```sh
# Start the project in dev mode
bun start:dev
```

## Paths

- Swagger API -> `<url>/docs`
- API -> `<url>/v<version>/`
