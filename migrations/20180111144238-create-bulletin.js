'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('bulletins', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            course_id: {
                type: Sequelize.INTEGER,
                allowNull:false,
                references:{
                    model:'courses',
                    key:'id',
                }
            },
            publisher_id: {
                type: Sequelize.INTEGER,
                allowNull:false,
                references:{
                    model:'teachers',
                    key:'id',
                }
            },
            body: {
                type: Sequelize.STRING,
                allowNull:false,
            },
            publish_time: {
                type: Sequelize.BIGINT(11),
                allowNull:false,
            },
        },{
            charset:'utf8'
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('bulletins');
    }
};