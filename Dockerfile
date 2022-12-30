FROM node:16-alpine as builder


ENV NODE_ENV build

WORKDIR /gavb-api-financial-flow

COPY package*.json /gavb-api-financial-flow/
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

RUN ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

RUN echo "America/Sao_Paulo" > /etc/timezone

ENV NODE_ENV production


COPY --from=builder --chown=node:node /gavb-api-financial-flow/package*.json ./
COPY --from=builder --chown=node:node /gavb-api-financial-flow/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /gavb-api-financial-flow/dist/ ./dist/

CMD ["node", "dist/main.js"]
