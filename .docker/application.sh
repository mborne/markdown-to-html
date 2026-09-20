#!/bin/sh

cd /opt/markdown-to-html

exec node dist/bin/main.js serve --layout=${LAYOUT} /data

