#!/bin/zsh

git pull

docker build -t bendit-server .

docker rm bendit-server

docker run -d -p 3000:3000 --name bendit-server bendit-server:latest