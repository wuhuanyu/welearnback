'use strict';
module.exports = (sequelize, DataTypes) => {
    var video = sequelize.define('video', {
        course_id: {
            type:DataTypes.INTEGER,
            references:{
                model:'courses',
                key:'id'
            }
        },
        name: DataTypes.STRING,
        size: DataTypes.INTEGER,
        link: DataTypes.STRING,
        avatar: DataTypes.STRING,
        upload_time:DataTypes.BIGINT(11),
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        charset:'utf8',
        timestamps:false,
    });
    return video;
};