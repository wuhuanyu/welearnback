'use strict';
module.exports = (sequelize, DataTypes) => {
    var Teacher = sequelize.define('teacher', {
        name: DataTypes.STRING,
        password:DataTypes.STRING,
        gender:DataTypes.INTEGER,
        token:DataTypes.STRING,
        login:DataTypes.BOOLEAN,
        avatar:DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
        
            }
        },
        timestamps:false,
        charset:'utf8'
    });
    return Teacher;
};