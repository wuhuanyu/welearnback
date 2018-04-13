'use strict';
module.exports = (sequelize, DataTypes) => {
    var live = sequelize.define('live', {
        course_id: {
            type:DataTypes.INTEGER,
            references:{
                model:'courses',
                key:'id'
            },
            allowNull:false,
        },
        // teacher_id:{
        //     type:DataTypes.INTEGER,
        //     references:{
        //         model:'teachers',
        //         key:'id'
        //     },
        //     allowNull:false
        // },
        title: {
            type:DataTypes.STRING,
            allowNull:false,
        },
        time:{
            type: DataTypes.BIGINT(11),
            allowNull:false,
        },
        url:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        is_going:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        },
        finish:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        }

    }, {
        charset:'utf8',
        timestamps:false,
    });
    live.associate = function(models) {
        // associations can be defined here
    };
    return live;
};