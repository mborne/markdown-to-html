#!/bin/sh

cd /opt/markdown-to-html

exec node dist/bin/main.js serve --host=0.0.0.0 --layout=${LAYOUT} /data

