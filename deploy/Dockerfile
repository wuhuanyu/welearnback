FROM ubuntu:16.04

EXPOSE 3000
EXPOSE 1883
EXPOSE 9001

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install git curl wget && \
    apt-get install -y build-essential && \
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    apt-get install -y nodejs && \

