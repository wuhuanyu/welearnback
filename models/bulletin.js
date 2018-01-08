'use strict';
module.exports = (sequelize, DataTypes) => {
  var bulletin = sequelize.define('bulletin', {
    body: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return bulletin;
};