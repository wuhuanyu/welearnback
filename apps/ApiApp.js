const ApiApp=require('express')();
const Qrouter= require('../routes/qrouter');
const AccRouter=require('../routes/accrouter');
import CourseRouter from '../routes/course_router';

ApiApp.use("/question",Qrouter);
ApiApp.use('/acc',AccRouter);
ApiApp.use('/course',CourseRouter);

module.exports=ApiApp;