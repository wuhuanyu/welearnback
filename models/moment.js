'use strict';
module.exports = (sequelize, DataTypes) => {
    var moment = sequelize.define('moment', {
        author_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'stus',
                key: 'id',
            }
        },
        course_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'courses',
                key: 'id',
            }
        },
        publish_time:DataTypes.BIGINT(11),
        body: DataTypes.STRING
    }, {
        timestamps: false,
        charset:'utf8',
    });
    moment.associate = function (models) {
    // associations can be defined here
    };
    return moment;
};