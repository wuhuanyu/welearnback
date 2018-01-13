const Sequelize = require('sequelize');
let db=process.env.NODE_ENV==="test"? "test":"welearn";
const sequelize = new Sequelize(db, 'root', 'why90951213', {
    host: 'localhost',
    dialect: 'mysql',
    logging:process.env.NODE_ENV!=="production",
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000,
    },
    omitNull:true,
});

module.exports=sequelize;