#!/bin/bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
mkdir uploads
chown -R rkonuhov:cogniance uploads
node db/init.js
chown -R rkonuhov:cogniance logs
apt-get install mongodb
npm -g i webpack
npm -g i bower
npm i
bower install
