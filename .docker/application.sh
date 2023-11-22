#!/bin/sh

cd /opt/markdown-to-html

exec node bin/main.js serve --layout=${LAYOUT} /data

