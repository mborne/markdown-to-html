#!/bin/sh

cd /opt/markdown-to-html

exec node bin/main.js -m serve --layout=${LAYOUT} /data

