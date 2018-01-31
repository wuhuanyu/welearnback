'use strict';
module.exports = (sequelize, DataTypes) => {
    var _Teacourse = sequelize.define('teacourse', {
        tId: {
            type:DataTypes.INTEGER,
            references:{model:'teachers',key:'id'}
        },
        cId:{
            type:DataTypes.INTEGER,
            references:{model:'courses',key:'id'}
        }
    }, {
        classMethods: {
            associate: function(models) {

            }
        },
        timestamps:false,
        charset:'utf8',
    });
    return _Teacourse;
};