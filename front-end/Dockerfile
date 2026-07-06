FROM node:22-alpine

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY back-end/package.json ./back-end/
COPY front-end/package.json ./front-end/
COPY back-end-e2e/package.json ./back-end-e2e/
COPY front-end-e2e/package.json ./front-end-e2e/

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npx", "nx", "dev", "front-end", "--", "--host", "0.0.0.0"]
