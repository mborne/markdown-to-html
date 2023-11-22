FROM node:20-alpine

# name or path to the layout
ENV LAYOUT default

COPY --chown=node:node . /opt/markdown-to-html
WORKDIR /opt/markdown-to-html
RUN npm install

VOLUME /data

EXPOSE 3000

CMD [ "/bin/sh", "/opt/markdown-to-html/.docker/application.sh" ]
