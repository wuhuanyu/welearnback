const Sequelize = require('sequelize');
const sequelize = new Sequelize('welearn', 'root', 'why90951213', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000,
    }
});

module.exports=sequelize;