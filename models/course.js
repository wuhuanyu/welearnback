'use strict';
module.exports = (sequelize, DataTypes) => {
    var _course = sequelize.define('course', {
        name: DataTypes.STRING,
        desc: DataTypes.TEXT('medium'),
    
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        charset:'utf8',
        timestamps:false,
    });
    return _course;
};