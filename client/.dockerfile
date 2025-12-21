FROM node:22
WORKDIR /app
RUN npm install g pnpm
COPY package*.json ./
COPY ppnpm-lock.yaml ./

RUN pnpm install
RUN pnpm build

COPY . .
EXPOSE 8080
CMD [ "pnpm" , "start" ]