FROM alpine:3.17
LABEL maintainer="Melaine Gérard <pro@melaine-gerard.fr>"
LABEL version="0.1"

WORKDIR /app


RUN apk update && apk add --update --no-cache \
tzdata \
nginx \
nano \
neovim \
supervisor \
nodejs \
npm

COPY package*.json ./
RUN npm install

COPY . .

ENV TZ Europe/Paris
EXPOSE 517

CMD [ "npm", "run", "dev" ]