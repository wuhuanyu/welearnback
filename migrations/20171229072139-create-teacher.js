
'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('teachers', {
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
            gender:{
                // allowNull:false,
                type:Sequelize.INTEGER,
            },
            avatar:{
                type:Sequelize.STRING,
                allowNull:false,
                defaultValue:'default_avatar.jpg',
            },
            token:{
                type:Sequelize.STRING,
                allowNull:true,
            },
            login:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
            },
            
        
        },{
            charset:'utf8',
            timestamps:false,
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('teachers');
    }
};