FROM node:22-slim As builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-slim
WORKDIR /app
COPY --from=builder app/node_modules ./node_modules
COPY . .
EXPOSE 8081
CMD [ "npm",  "run", "dev", "--", "--lan" ]