'use strict';
module.exports = (sequelize, DataTypes) => {
  var s_fileupload = sequelize.define('fileupload', {
    //author type
    aT:DataTypes.INTEGER,
    //author id ,sId or tId
    aId: DataTypes.INTEGER,

    //for type
    forT:DataTypes.INTEGER,
    //for id
    fId:DataTypes.INTEGER,
    
    //file type file,image
    fT:DataTypes.INTEGER,

    //dir
    dir: DataTypes.STRING,

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return s_fileupload;
};