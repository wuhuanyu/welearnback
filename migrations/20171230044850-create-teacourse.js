'use strict';
// const Teacher = require('../models/models').Teacher;
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teacourse', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tId: {
        type: Sequelize.INTEGER,
        references:{model:'teachers',key:'id'}
      },
      cId: {
        type: Sequelize.INTEGER,
        references:{model:'courses',key:'id'}
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teacourse');
  }
};