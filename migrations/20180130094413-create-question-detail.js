'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('question_details', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            question_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: null,
                references:{
                    model:'stus',
                    key:'id',
                }
            },
            finished: {
                type: Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
            },
        }, {
            timestamps: false,
        }).then(()=>{
            // return queryInterface.sequelize.query('ALTER TABLE question_details drop primary key,add PRIMARY KEY (question_id,student_id)');
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('question_details');
    }
};