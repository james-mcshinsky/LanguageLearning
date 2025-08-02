FROM node:18-alpine

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install

COPY services ./services
COPY shared ./shared
COPY index.ts ./

RUN npm run build

CMD ["node", "dist/index.js"]
