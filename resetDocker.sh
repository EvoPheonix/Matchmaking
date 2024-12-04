#! /bin/bash

sudo systemctl start docker
sudo docker build -t dwellers-matchmaking .
sudo docker ps -q | xargs sudo docker rm -f -v
sudo docker container prune -f
sudo docker run -d -p 127.0.0.1:3000:3000 --mount type=volume,src=DB,target=//etc/todos dwellers-matchmaking
echo "app running at: 127.0.0.1:3000"