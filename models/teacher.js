'use strict';
module.exports = (sequelize, DataTypes) => {
	var Teacher = sequelize.define('teacher', {
		name: DataTypes.STRING,
		password:DataTypes.STRING,
		gender:DataTypes.INTEGER,
		push_token:DataTypes.STRING,
		login:DataTypes.BOOLEAN,
	}, {
		classMethods: {
			associate: function(models) {
        
			}
		}
	});
	return Teacher;
};