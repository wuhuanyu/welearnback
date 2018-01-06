import { read } from 'fs';

const db=require('../mysqlcon');
const Sequelize =require('sequelize');
const Course=require('./models').Course;
const Teacher=require('./models').Teacher;

const Message=db.define("message",{
    // id:{
    //     type:Sequelize.INTEGER,
    //     autoIncrement:true,
    //     primaryKey:true,
    //     allowNull:false,
    // },
    sender_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Teacher,
            key:'id',
        },
    },
    recipient_course_id:{
        type:Sequelize.INTEGER,
        references:{
            model:Course,
            key:'id',
        },
        allowNull:false,
    },
    send_time:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.NOW,
        allowNull:false,
    },
    //TODO: defaultValue
    expire_time:{
        type:Sequelize.DATE,
        allowNull:true
    },
    body:{
        type:Sequelize.STRING,
        allowNull:false,
    }
},{
    timestamps:false,
});

module.exports=Message;