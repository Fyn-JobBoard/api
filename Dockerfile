FROM oven/bun:alpine AS dev

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "start:dev"]

FROM oven/bun:alpine AS prod

WORKDIR /app

COPY --from=dev /app .

RUN bun run build

RUN bun remove -p

EXPOSE 3000

CMD ["bun", "start:prod"]
