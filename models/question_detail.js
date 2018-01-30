'use strict';
module.exports = (sequelize, DataTypes) => {
    var question_detail = sequelize.define('question_detail', {
        question_id: DataTypes.INTEGER,
        student_id: {
           type: DataTypes.INTEGER,
           references:{
               model:'stus',
               key:'id'
           }
        },
        finished: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return question_detail;
};