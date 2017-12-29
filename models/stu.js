import sequelize from '../mysqlcon';
const Sequelize=require('sequelize');
const Stu=sequelize.define('stu',{
    name:Sequelize.STRING,
    password:Sequelize.STRING,
    gender:{
        type:Sequelize.ENUM,
        values:[0,1]
    }
});

