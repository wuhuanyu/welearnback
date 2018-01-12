#!/usr/bin/env zsh
rm -rf ./uploads && mkdir ./uploads && mkdir ./uploads/images
sequelize db:migrate:undo:all && sequelize db:migrate && sequelize db:seed:all 
cp ./examples/* ./uploads/images



