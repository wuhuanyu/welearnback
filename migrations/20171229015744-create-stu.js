'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('stus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.INTEGER
            },
            push_token:{
                type:Sequelize.STRING,
                allowNull:true,
            },
            login:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
            },
            avatar:{
                type:Sequelize.STRING,
                allowNull:true,
                defaultValue:'default_avatar.jpg'
            },
            
        },{
            charset:'utf8',
            timestamps:false,
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('stus');
    }
};