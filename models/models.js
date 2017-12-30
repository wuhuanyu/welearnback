const db = require('../mysqlcon');
const Question = require('./question');
const Comment = require('./comment');



let Stu = db.import(__dirname + "/stu.js");
Stu.checkedFields = ['name', 'password', 'gender'];

let Teacher = db.import(__dirname + "/teacher.js");
Teacher.checkedFields = ['name', 'password', 'gender'];

let Course = db.import(__dirname + '/course.js');
Course.checkedFields = ['name', 'dec'];

let TeaCourse = db.import(__dirname + '/teacourse.js');


module.exports = {
    Question: Question,
    Comment: Comment,
    Stu: Stu,
    Teacher: Teacher,
    Course: Course,
    TeaCourse: TeaCourse,
};

