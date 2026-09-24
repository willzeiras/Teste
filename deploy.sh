#!/bin/bash
# Deploy automático do site: puxa o GitHub e, se mudou, rebuilda e atualiza o serviço.
set -e
cd /root/site-elevemakers
git fetch -q origin main
LOCAL=$(git rev-parse HEAD); REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ] || [ "$1" = "--force" ]; then
  git reset -q --hard origin/main
  docker build -q -t site-elevemakers:latest . >/dev/null
  docker service update --force --image site-elevemakers:latest --detach site_web >/dev/null 2>&1 \
    || docker stack deploy -c stack.yml site >/dev/null
  echo "$(date '+%F %T') deploy $(git rev-parse --short HEAD)" >> /root/site-elevemakers/deploy.log
fi
