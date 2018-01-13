'use strict';
module.exports = (sequelize, DataTypes) => {
	var _stucourse = sequelize.define('stucourse', {
		sId:{
			type:DataTypes.INTEGER,
		},
		cId:{
			type:DataTypes.INTEGER,
		}

	}, {
		classMethods: {
			associate: function(models) {
				// associations can be defined here
			}
		}
	});
	return _stucourse;
};