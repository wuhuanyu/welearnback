'use strict';
module.exports = (sequelize, DataTypes) => {
  var s_fileupload = sequelize.define('s_fileupload', {
    //author type
    aT:DataTypes.INTEGER,
    //author id ,sId or tId
    aId: DataTypes.INTEGER,
    //dir
    dir: DataTypes.STRING,
    //question id ,
    qId: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return s_fileupload;
};