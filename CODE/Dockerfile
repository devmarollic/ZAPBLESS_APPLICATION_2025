FROM node:lts-alpine as builder

WORKDIR /app
COPY . .

WORKDIR /app/SERVER
RUN yarn install && yarn run build && rm -rf node_modules

COPY --from=builder /app/SERVER/dist .

ENV HOST 0.0.0.0
ENV PORT 8000

EXPOSE 8000

CMD ["node", "index.js"]