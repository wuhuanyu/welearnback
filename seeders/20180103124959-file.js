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
    return queryInterface.bulkInsert('fileuploads', [
      // image for question
      { aT: 11, aId: 1, forT: 42, fId: 1, original_name: 'math1.jpg', name: 'math1.jpg', dir: 'math1.jpg',fT:53 },
      { aT: 11, aId: 1, forT: 42, fId: 1, original_name: 'math2.jpg', name: 'math2.jpg', dir: 'math2.jpg' ,fT:53 },

      { aT: 11, aId: 1, forT: 42, fId: 2, original_name: 'history1.jpg', name: 'history1.jpg', dir: 'history1.jpg',fT:53  },
      { aT: 11, aId: 1, forT: 42, fId: 2, original_name: 'history2.jpg', name: 'history2.jpg', dir: 'history2.jpg',fT:53  },

      { aT: 11, aId: 1, forT: 42, fId: 3, original_name: 'art1.jpg', name: 'art1.jpg', dir: 'art1.jpg',fT:53  },
      { aT: 11, aId: 1, forT: 42, fId: 3, original_name: 'art2.jpg', name: 'art2.jpg', dir: 'art2.jpg',fT:53  },

      //image for question
      { aT: 11, aId: 1, forT: 43, fId: 1, original_name: 'math1.jpg', name: 'math1.jpg', dir: 'math1.jpg' ,fT:53},
      { aT: 11, aId: 1, forT: 43, fId: 1, original_name: 'math2.jpg', name: 'math2.jpg', dir: 'math2.jpg' ,fT:53},

      { aT: 11, aId: 1, forT: 43, fId: 2, original_name: 'history1.jpg', name: 'history1.jpg', dir: 'history1.jpg',fT:53  },
      { aT: 11, aId: 1, forT: 43, fId: 2, original_name: 'history2.jpg', name: 'history2.jpg', dir: 'history2.jpg',fT:53  },

      { aT: 11, aId: 1, forT: 43, fId: 3, original_name: 'art1.jpg', name: 'art1.jpg', dir: 'art1.jpg',fT:53  },
      { aT: 11, aId: 1, forT: 43, fId: 3, original_name: 'art2.jpg', name: 'art2.jpg', dir: 'art2.jpg',fT:53  },
      //image for comment
      { aT: 11, aId: 1, forT: 41, fId: 1, original_name: 'math1.jpg', name: 'math1.jpg', dir: 'math1.jpg',fT:53  },
      { aT: 11, aId: 1, forT: 41, fId: 1, original_name: 'math2.jpg', name: 'math2.jpg', dir: 'math2.jpg' ,fT:53 },

      { aT: 11, aId: 1, forT: 41, fId: 2, original_name: 'history1.jpg', name: 'history1.jpg', dir: 'history1.jpg' ,fT:53 },
      { aT: 11, aId: 1, forT: 41, fId: 2, original_name: 'history2.jpg', name: 'history2.jpg', dir: 'history2.jpg' ,fT:53 },
      
      { aT: 11, aId: 1, forT: 41, fId: 3, original_name: 'art1.jpg', name: 'art1.jpg', dir: 'art1.jpg' ,fT:53 },
      { aT: 11, aId: 1, forT: 41, fId: 3, original_name: 'art2.jpg', name: 'art2.jpg', dir: 'art2.jpg' ,fT:53 },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
