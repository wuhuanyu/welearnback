
'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('fileuploads', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			//author type
			aT:{
				type:Sequelize.INTEGER,
				allowNull:false,
			},

			//author id
			aId: {
				type: Sequelize.INTEGER,
				allowNull:false,
			},

			//for type comment,question,course
			forT:{
				type:Sequelize.INTEGER,
				allowNull:false,
			},
			//fId
			fId:{
				type:Sequelize.STRING,
				allowNull:false,
			},
			//file type,indicating this is a image or common file 
			fT:{
				type:Sequelize.INTEGER,
				allowNull:false,
			},
			//original name
			original_name:{
				type:Sequelize.STRING,
				allowNull:false,
			},
			name:{
				type:Sequelize.STRING,
				allowNull:false,
			},

			dir: {
				type: Sequelize.STRING,
				allowNull:false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt:{
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue:Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
			}
		},{
			charset:'utf8'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('fileuploads');
	}
};