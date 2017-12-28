'use strict';
module.exports = (sequelize, DataTypes) => {
  var teacher = sequelize.define('Teacher', {
    name: DataTypes.STRING,
    passwd: DataTypes.STRING,
    gender: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return teacher;
};