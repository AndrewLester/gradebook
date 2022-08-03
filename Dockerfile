# syntax = docker/dockerfile:1.3
# Install dependencies only when needed
FROM node:16-slim AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
COPY . /app
RUN --mount=type=secret,id=GOOGLE_APPLICATION_CREDENTIALS_CONTENT --mount=type=secret,id=GOOGLE_APPLICATION_CREDENTIALS \
    echo "$(cat /run/secrets/GOOGLE_APPLICATION_CREDENTIALS_CONTENT)" > "$(cat /run/secrets/GOOGLE_APPLICATION_CREDENTIALS)" && \
    sed -ie "s/'/\"/g" "$(cat /run/secrets/GOOGLE_APPLICATION_CREDENTIALS)" && \
    sed -ie "s/*/,/g" "$(cat /run/secrets/GOOGLE_APPLICATION_CREDENTIALS)"
WORKDIR /app
# RUN npm install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
RUN npm ci

# Add `ARG` instructions below if you need `PUBLIC_` variables 
# then put the value on your fly.toml
# Example:
# ARG PUBLIC_EXAMPLE="value here"

RUN npm run build

ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.8/litestream-v0.3.8-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

# Production image, copy all the files and run next
FROM node:16-slim AS runner


RUN apt-get update
RUN apt-get install -y openssl
RUN apt-get install ca-certificates -y && update-ca-certificates

ENV NODE_ENV production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 sveltekit
# USER sveltekit

# RUN apk add bash
RUN mkdir -p /data

COPY --from=builder /app /app
COPY --from=builder /usr/local/bin/litestream /usr/local/bin/litestream

WORKDIR /app

RUN npm ci --prod
RUN npm run prisma-setup

ENV PORT 8080
EXPOSE 8080

COPY etc/litestream.yml /etc/litestream.yml
COPY scripts/run.sh /scripts/run.sh

CMD [ "/bin/sh", "/scripts/run.sh" ]
