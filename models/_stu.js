'use strict';
module.exports = (sequelize, DataTypes) => {
  var _stu = sequelize.define('_stu', {
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
  return _stu;
};