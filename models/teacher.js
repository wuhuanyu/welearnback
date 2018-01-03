'use strict';
module.exports = (sequelize, DataTypes) => {
  var Teacher = sequelize.define('teacher', {
    name: DataTypes.STRING,
    password:DataTypes.STRING,
    gender:DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });
  return Teacher;
};