'use strict';

module.exports = (sequelize, DataTypes) => {
    var _stu = sequelize.define('stu', {
        name: DataTypes.STRING,//名字
        password: DataTypes.STRING,//密码
        gender: DataTypes.INTEGER,//性别
        token:DataTypes.STRING,//登录token
        login:DataTypes.BOOLEAN,//是否已经登录
        avatar:DataTypes.STRING,//头像
    }, {
        classMethods: {
            associate: function(models) {
            }
        },
        timestamps:false,
        charset:'utf8',//字符集，支持中文
    });
    return _stu;
};





