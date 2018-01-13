'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
		return queryInterface.bulkInsert('courses',[
			{name:'Math',desc:'Advanced math'},
			{name:'History',desc:'History of Acient Greek'},
			{name:'Art',desc:'Modern European Art'},
		]);
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      // return queryInterface.bulkDelete('Person', null, {});
    */

		return queryInterface.bulkDelete('courses', null, {});
	}
};
