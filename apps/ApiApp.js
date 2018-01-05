const ApiApp=require('express')();
const Qrouter= require('../routes/qrouter');
const AccRouter=require('../routes/accrouter');
import * as constants from '../constants';
import CourseRouter from '../routes/course_router';
require('express-async-errors');
const FileUploadRouter=require('../routes/filerouter');
// const fileUpload=require('express-fileupload');


/**
 * add authenticated information
 * /api/v1/acc
 */

ApiApp.use('/acc',AccRouter);

ApiApp.use((req,res,next)=>{
    req.auth={
        type:constants.ACC_T_Tea,
        id:1,
        name:"MrZhao",
        password:"pass",
    };
    next();
});
ApiApp.use("/question",Qrouter);
ApiApp.use('/course',CourseRouter);
ApiApp.use('/file',FileUploadRouter);
module.exports=ApiApp;