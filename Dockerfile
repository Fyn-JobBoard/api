FROM oven/bun:alpine AS dev

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "start:dev"]

FROM dev AS prod-build

ARG KEEP_CONSOLE=0
ARG KEEP_MAPS=0
ARG KEEP_TYPES=0

RUN if [ $BUILD_CONSOLE = 0 -o $BUILD_CONSOLE = no ]; then rm -rf console; fi
RUN bun run build

WORKDIR /app/dist

RUN if [ $KEEP_MAPS = 0 -o $KEEP_MAPS = no ]; then (\
  find . \( \( -path "./src/**" -o -path "./db/**" \) -a -name "*.map" \) -delete;\
  rm -f tsconfig.build.*; \
); fi
RUN if [ $KEEP_TYPES = 0 -o $KEEP_TYPES = no ]; then (\
  find . \( \( -path "./src/**" -o -path "./db/**" \) -a -name "*.d.ts" \) -delete; \
); fi

FROM oven/bun:slim AS prod

WORKDIR /app

COPY --from=prod-build /app/dist .
COPY --from=prod-build /app/prod.sh .

RUN bun install --production

ENV NODE_ENV=production
ENV NODE_PATH=.

EXPOSE 3000

ENTRYPOINT [ "./prod.sh" ]
