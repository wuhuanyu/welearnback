const ApiApp = require('express')();
const AccRouter = require('../routes/accrouter');
import * as constants from '../constants';
import CourseRouter from '../routes/course_router';
const FileUploadRouter = require('../routes/filerouter');
const redis=require('../globals').redis;


// ApiApp.use(bodyParser.json());
// ApiApp.use(bodyParser.urlencoded({ extended: true }));
// const fileUpload=require('express-fileupload');

/**
 * refresh token
 */

ApiApp.use(async(req,res,next)=>{
    let authorization=req.get('authorization');
    if(authorization){
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];

        let found = await redis.hgetallAsync(`${type}:user:${id}`);
        console.log(found);
        if(found){
            req.auth={};
            if (found.token !== token) req.auth=null;
            else {
                await redis.expireAsync(`${type}:user:${id}`,30*60);
                req.auth.id = id;
                req.auth.name = found.username;
                req.auth.password = found.password;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
            }
        }
    }
    next();
});
ApiApp.use('/heartbeat',async(req,res,next)=>{
    let authorization=req.get('authorization');
    if(authorization){
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];

        let found = await redis.hgetallAsync(`${type}:user:${id}`);
        console.log(found);
        if(found){
            redis.expireAsync(`${type}:user:${id}`,30*60);
        }
    }
    res.end();
});
ApiApp.use('/acc', AccRouter);


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