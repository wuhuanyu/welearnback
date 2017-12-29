import sequelize from '../mysqlcon';
const Sequelize =require('sequelize');
const Course=sequelize.define('course',{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    desc:{
        type:Sequelize.STRING,
        allowNull:false,
    }
});

export default Course;