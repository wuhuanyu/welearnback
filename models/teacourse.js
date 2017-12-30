'use strict';
module.exports = (sequelize, DataTypes) => {
  var _Teacourse = sequelize.define('teacourse', {
    tId: {
      type:DataTypes.INTEGER,
      references:{model:'teacher',key:'id'}
    },
    cId:{
      type:DataTypes.INTEGER,
      references:{model:'course',key:'id'}
    }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });
  return _Teacourse;
};