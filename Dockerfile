FROM node:24-alpine

# name or path to the layout
ENV LAYOUT=default

COPY --chown=node:node . /opt/markdown-to-html
WORKDIR /opt/markdown-to-html
USER node
RUN npm ci && npm run build && npm prune --omit=dev

VOLUME /data

EXPOSE 3000

CMD [ "/bin/sh", "/opt/markdown-to-html/.docker/application.sh" ]
