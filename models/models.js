const db = require('../mysqlcon');
const Question = require('./question');
const Comment = require('./comment');



let Stu = db.import(__dirname + '/stu.js');
Stu.checkedFields = ['name', 'password', 'gender'];

let Teacher = db.import(__dirname + '/teacher.js');
Teacher.checkedFields = ['name', 'password', 'gender'];

let Course = db.import(__dirname + '/course.js');
Course.checkedFields = ['name', 'dec'];

let StuCourse=db.import(__dirname+'/stucourse.js');

let TeaCourse = db.import(__dirname + '/teacourse.js');

let UploadFile=db.import(__dirname+'/fileupload.js');
UploadFile.checkedFields=['aT','aId','forT','fId','fT','original_name','name','dir'];

let Bulletin=db.import(__dirname+'/bulletin.js');
// Bulletin.checkedFields=['body']

module.exports = {
    Question: Question,
    Comment: Comment,
    Stu: Stu,
    Teacher: Teacher,
    Course: Course,
    TeaCourse: TeaCourse,
    StuCourse:StuCourse,
    UploadFile:UploadFile,
    Bulletin:Bulletin,
    Message:db.import(__dirname+'/message.js'),
    MessageRecipient:db.import(__dirname+'/message_recipient.js'),
    // Message:require('./message'),
};

