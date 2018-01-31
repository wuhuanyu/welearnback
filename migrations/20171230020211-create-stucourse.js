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
           
        },{
            charset:'utf8',
            timestamps:false,
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('stucourses');
    }
};