#!/bin/zsh

git pull

docker build -t bendit-server .

docker restart bendit-server