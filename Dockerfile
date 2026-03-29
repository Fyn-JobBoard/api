FROM oven/bun:alpine AS dev

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "start:dev"]

FROM dev AS prod

RUN bun run build

RUN rm -rf node_modules && bun install --production

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "./prod.sh" ]
