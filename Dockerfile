FROM node:17.1.0-slim

LABEL maintainer="Jonathan Gros-Dubois"
LABEL version="16.0.1"
LABEL description="Docker file for SocketCluster with support for clustering."

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN yarn 

EXPOSE 8000

CMD ["yarn", "serve"]
