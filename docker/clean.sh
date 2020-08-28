#!/usr/bin/env bash
set -eo pipefail

docker stop --time 0 $(docker ps)
docker rm -f $(docker ps -a)
docker rmi -f $(docker images -a)
docker system prune -a
