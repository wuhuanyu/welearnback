'use strict';
module.exports = (sequelize, DataTypes) => {
	var bulletin = sequelize.define('bulletin', {
		course_id: {
			type: DataTypes.INTEGER,
			references:{
				model:'courses',
				key:'id'
			}
		},
		publisher_id: {
			type:  DataTypes.INTEGER,
			references:{
				model:'teachers',
				key:'id',
			}
		},
		body: DataTypes.STRING,
		publish_time: DataTypes.BIGINT(11),
    
	}, {
		classMethods: {
			associate: function(models) {
				// associations can be defined here
			},
		},
		timestamps:false,
		charset:'utf8',
	});
	return bulletin;
};