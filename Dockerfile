FROM node:13

# name or path to the layout
ENV LAYOUT default

COPY --chown=node:node . /opt/markdown-to-html
WORKDIR /opt/markdown-to-html
RUN npm install -g

VOLUME /data

EXPOSE 3000

USER node
CMD [ "/bin/bash", "/opt/markdown-to-html/docker/application.sh" ]

