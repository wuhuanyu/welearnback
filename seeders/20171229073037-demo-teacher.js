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
        return queryInterface.bulkInsert('teachers',[
            {name:'MrZhao',password:'1a1dc91c907325c69271ddf0c944bc72',gender:21},
            {name:'MrsQian',password:'1a1dc91c907325c69271ddf0c944bc72',gender:22},
            {name:'MrsWu',password:'1a1dc91c907325c69271ddf0c944bc72',gender:22},
            {name:'MrWu',password:'1a1dc91c907325c69271ddf0c944bc72',gender:21},
            {name:'MrSiMa',password:'1a1dc91c907325c69271ddf0c944bc72',gender:21},
        ]);
    },

    down: (queryInterface, Sequelize) => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
        return queryInterface.bulkDelete('teachers', null, {});
    }
};
