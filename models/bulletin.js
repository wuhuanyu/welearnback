'use strict';
module.exports = (sequelize, DataTypes) => {
  var bulletin = sequelize.define('bulletin', {
    course_id: DataTypes.INTEGER,
    publisher_id: DataTypes.INTEGER,
    body: DataTypes.STRING,
    time: DataTypes.INTEGER,
    
  },{
    timestamp:false,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return bulletin;
};