import sequelize from '../mysqlcon';
const Sequelize=require('sequelize');
const Stu=sequelize.define('stu',{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    gender:{
        type:Sequelize.ENUM,
        values:[0,1]
    }
});

Stu.checkedFields=['name','password','gender'];
export default Stu;


