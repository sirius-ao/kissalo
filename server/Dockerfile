# ---------- Start Server ----------
FROM node:22 as start
WORKDIR /app
RUN npm install -g pnpm
COPY  package.json ./
COPY  pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm migrate
RUN pnpm generate
RUN pnpm build
EXPOSE 8080
CMD ["pnpm", "start"]