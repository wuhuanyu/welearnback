'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('moments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            author_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'stus',
                    key: 'id',
                }
            },
            course_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'courses',
                    key: 'id',
                }
            },
            publish_time:Sequelize.BIGINT(11),
            body: Sequelize.STRING,
        },{
            timestamps:false,
            charset:'utf8',
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('moments');
    }
};