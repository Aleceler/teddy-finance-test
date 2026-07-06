FROM node:22-alpine

WORKDIR /workspace

RUN apk add --no-cache python3 make g++ wget

COPY package.json package-lock.json ./
COPY back-end/package.json ./back-end/
COPY front-end/package.json ./front-end/
COPY back-end-e2e/package.json ./back-end-e2e/
COPY front-end-e2e/package.json ./front-end-e2e/

RUN npm install

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=10 --start-period=90s \
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["npx", "nx", "serve", "back-end"]
