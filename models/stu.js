'use strict';
module.exports = (sequelize, DataTypes) => {
  var Stu = sequelize.define('Stu', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Stu;
};