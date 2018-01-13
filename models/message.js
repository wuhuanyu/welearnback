'use strict';
module.exports = (sequelize, DataTypes) => {
	var message = sequelize.define('message', {
		is_teacher_send:DataTypes.BOOLEAN,
		teacher_id:{
			type:DataTypes.INTEGER,
			references:{model:'teachers',key:'id'},
		},
		student_id:{
			type:DataTypes.INTEGER,
			references:{model:'stus',key:'id'},
		},
		send_time: DataTypes.BIGINT(11),
		body: DataTypes.STRING,
	}, {
		classMethods: {
			associate: function(models) {
				// associations can be defined here
			}
		},
		timestamps:false,
		charset:'utf8',
	});
	return message;
};