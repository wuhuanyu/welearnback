const ApiApp = require('express')();
const Qrouter = require('../routes/qrouter');
const AccRouter = require('../routes/accrouter');
import * as constants from '../constants';
import CourseRouter from '../routes/course_router';
const FileUploadRouter = require('../routes/filerouter');


// ApiApp.use(bodyParser.json());
// ApiApp.use(bodyParser.urlencoded({ extended: true }));
// const fileUpload=require('express-fileupload');


/**
 * add authenticated information
 * /api/v1/acc
 */

ApiApp.use('/acc', AccRouter);

ApiApp.use((req, res, next) => {
    req.auth = {
        type: constants.ACC_T_Tea,
        id: 1,
        name: "MrZhao",
        password: "pass",
    };
    next();
});
ApiApp.use("/question", Qrouter);
ApiApp.use('/course', CourseRouter);
ApiApp.use('/file', FileUploadRouter);

ApiApp.use('/message',require('../routes/message_router'));
ApiApp.use(function (err, req, res, next) {
    // console.log(err.code);
    res.status(err.code || 500).json({
        msg: err.msg || err.message,
    })
});


module.exports=ApiApp;