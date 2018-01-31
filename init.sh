#!/usr/bin/env zsh
rm -rf ./uploads && mkdir ./uploads && mkdir ./uploads/images &&  mkdir ./uploads/avatars
sequelize db:migrate:undo:all && sequelize db:migrate && sequelize db:seed:all 
cp -r ./fixtures/* ./uploads



