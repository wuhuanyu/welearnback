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
        },
        finished:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        score:{
            type:DataTypes.INTEGER,
            allowNull:true,
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