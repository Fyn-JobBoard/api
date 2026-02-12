# API Fyn

## With Docker

Run the following command to start the Docker container.
This container will auto update files from `./src`.

```sh
# Configure the environement variables
cp .env{.example,}

# After you've edited the variables
docker compose -f compose.dev.yml up
```

## Without Docker

### Requirement

The API uses a Postgres driver for the database, so you must have a running postgres to develop the API.

If you want you can use a docker container to do this:

```sh
docker run -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=fyn -e POSTGRES_USER=postgres  -p 5432:5432 postgres
```

> replaces properties related to the .env

### Launch the project

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
