# Docker Image


#### Docker cleaning
```bash
docker stop --time 0 $(docker ps)
docker rm -f $(docker ps -a)
docker rmi -f $(docker images -a)
docker system prune -a
```


#### Building and pushing image
```bash
cd ./docker
sh ./image_build.sh
sh ./image_push.sh
```
