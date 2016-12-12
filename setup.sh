#!/bin/bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
mkdir uploads
chown -R rkonuhov:cogniance uploads
node db/init.js
chown -R rkonuhov:cogniance logs
#install mongodb >3.2
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
# ubuntu 14.04
# echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
# ubuntu 16.04
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
apt-get update
apt-get install -y mongodb-org
sudo service mongod startFailed to start mongodb.service: Unit mongodb.service is masked.

npm -g i webpack
npm -g i bower
npm i
bower install
npm run build
npm install -g pm2
pm2 start server.js