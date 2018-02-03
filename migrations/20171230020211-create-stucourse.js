'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('stucourses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            sId:{
                type:Sequelize.INTEGER,
                references:{model:'stus',key:'id'},
            },
            cId:{
                type:Sequelize.INTEGER,
                references:{model:'courses',key:'id'},
            },
            finished:{
                type:Sequelize.BOOLEAN,
                defaultValue:false,
                allowNull:false,
            },
            score:{
                type:Sequelize.INTEGER,
                allowNull:true,
            }
           
        },{
            charset:'utf8',
            timestamps:false,
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('stucourses');
    }
};