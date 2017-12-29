'use strict';
module.exports = (sequelize, DataTypes) => {
  var _course = sequelize.define('course', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return _course;
};