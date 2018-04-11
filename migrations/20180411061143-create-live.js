'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('lives', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            course_id: {
                type: Sequelize.INTEGER,
                references:{
                    model:'courses',
                    key:'id',
                },
                allowNull:false,
            },
            teacher_id: {
                type: Sequelize.INTEGER,
                references:{
                    model:'teachers',
                    key:'id',
                },
                allowNull:false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull:false,
            },
            time: {
                type: Sequelize.BIGINT(11),
                allowNull:false,
            },
            is_going:{
                type:Sequelize.BOOLEAN,
                defaultValue:false,
            },
            url:{
                type:Sequelize.STRING,
                allowNull:false,
            }


        },{
            charset:'utf8',
            timestamps:false
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('lives');
    }
};