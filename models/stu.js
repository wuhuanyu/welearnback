'use strict';

module.exports = (sequelize, DataTypes) => {
    var _stu = sequelize.define('stu', {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        gender: DataTypes.INTEGER,
        push_token:DataTypes.INTEGER,
        login:DataTypes.BOOLEAN,
        avatar:DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        timestamps:false,
        charset:'utf8',
    });
    return _stu;
};





