'use strict';
module.exports = (sequelize, DataTypes) => {
    var _stucourse = sequelize.define('stucourse', {
        sId:{
            type:DataTypes.INTEGER,
            references:{
                model:'stus',
                key:'id',
            }
        },
        cId:{
            type:DataTypes.INTEGER,
            references:{
                model:'courses',
                key:'id'
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        timestamps:false,
    });
    return _stucourse;
};