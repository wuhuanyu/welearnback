'use strict';

module.exports = (sequelize, DataTypes) => {
  var _stu = sequelize.define('stu', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return _stu;
};


// Stu.checkedFields=['name','gender','password'];


// module.exports.Stu=Stu·;

