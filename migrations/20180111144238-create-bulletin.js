'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bulletins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'courses',
          key:'id',
        }
      },
      publisher_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'teachers',
          key:'id',
        }
      },
      body: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      time: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bulletins');
  }
};