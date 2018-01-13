'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('messages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			is_teacher_send:{
				type:Sequelize.BOOLEAN,
				allowNull:false,  
			},
			teacher_id: {
				type: Sequelize.INTEGER,
				references:{
					model:'teachers',
					key:'id'
				},
				allowNull:true,  
			},
			student_id:{
				type:Sequelize.INTEGER,
				references:{
					model:'stus',
					key:'id',
				},
				allowNull:true,
			},
			send_time: {
				type: Sequelize.BIGINT(11),
				allowNull:false,
			},
			body: {
				type: Sequelize.STRING,
				allowNull:false,
			},
    
		},{
			timestamps:false,
			charset:'utf8'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('messages');
	}
};