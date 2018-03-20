'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('videos', {
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
                }
            },
            name: {
                type: Sequelize.STRING
            },
            size: {
                type: Sequelize.INTEGER
            },
            link: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING
            },
            upload_time:{
                type:Sequelize.BIGINT(11),
            }
        },{
            timestamps:false,
            charset:'utf8'
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('videos');
    }
};