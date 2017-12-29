const ApiApp=require('express')();
const Qrouter= require('../routes/qrouter');
const AccRouter=require('../routes/accrouter');
import * as constants from '../constants';
import CourseRouter from '../routes/course_router';

/**
 * add authenticated information
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

module.exports=ApiApp;