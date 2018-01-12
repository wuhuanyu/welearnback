'use strict';
module.exports = (sequelize, DataTypes) => {
  var message_recipient = sequelize.define('message_recipient', {
    message_id: DataTypes.INTEGER,
    recipient_course_id: DataTypes.INTEGER,
    recipient_stu_id: DataTypes.INTEGER,
    recipient_teacher_id:DataTypes.INTEGER,
    is_read: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return message_recipient;
};