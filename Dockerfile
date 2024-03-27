FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm run build

FROM base
RUN mkdir -p /app
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
COPY --from=builder /app/build /app/build

ENV PORT=80
EXPOSE 80
CMD ["node", "build"]