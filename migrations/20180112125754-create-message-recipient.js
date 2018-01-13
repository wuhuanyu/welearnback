'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('message_recipients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            message_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'messages',
                    key: 'id',
                },
                allowNull: false,
            },
            recipient_course_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'courses',
                    key: 'id',
                },
                allowNull: false,
            },
            recipient_stu_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'stus',
                    key: 'id',
                },
                allowNull: false,
            },
            recipient_teacher_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'teachers',
                    key: 'id',
                },
                allowNull: false,
            },

            is_read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        }, {
            timestamps: false,
            charset: 'utf8',
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('message_recipients');
    }
};