
const applyEMW=require('../utils/async_middleware');
const getErr=require('../utils/error');
const Teacher=require('../models/models').Teacher;
const Student=require('../models/models').Stu;
const md5=require('md5');
const constants=require('../constants');
import * as express from 'express';
import {redis} from '../globals';
/**
 * basic auth 
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 */

const checkAuth=async (isTeacher,name,pass)=>{
    let user=isTeacher?Teacher:Student;
    let found= await user.findOne({where:{name:name,password:md5(pass)}});
    return found;
};
module.exports.teacher_auth=applyEMW(async (req,res,next)=>{
    req.auth={};
    let authorization=req.get('authorization');
    if(!authorization) {
        res.set('WWW-Authenticate','Basic realm="Authorization Required"');
        throw getErr(401,'Authorization Required');
    }
    else{
        //TODO: try catch
        let credentials=new Buffer(authorization.split(' ').pop(),'base64').toString('ascii').split(':');

        let found=await redis.hgetAsync(`user:${credentials[0]}`);
        if(found) {
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            // req.auth.gender=found.gender;
            req.avatar=found.avatar;
            req.type=constants.ACC_T_Tea;
            next();
        }
        else throw getErr(403,'Access Denied (incorrect credentials)');
    }
});

/**
 * 之所以分开写，是考虑到将来 老师的验证可能需要更复杂的逻辑
 */
module.exports.student_auth=applyEMW(async (req,res,next)=>{
    req.auth={};
    // console.log(JSON.stringify(req.body));
    let authorization=req.get('authorization');
    if(!authorization) {
        res.set('WWW-Authenticate','Basic realm="Authorization Required"');
        throw getErr(401,'Authorization Required');
    }
    else{
        let credentials=new Buffer(authorization.split(' ').pop(),'base64').toString('ascii').split(':');
        //    console.log(pass);

        let found=await redis.hgetAsync(`user:${credentials[0]}`);

        if(found){
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            // req.auth.gender=found.gender;
            req.auth.avatar=found.avatar;
            req.auth.type=constants.ACC_T_Stu;
            next();
        }
        else throw getErr(403,'Access Denied (incorrect credentials)');
    }
});


/**
 * 
 * @param {*} req  requst must have type field
 * @param {*} res 
 * @param {*} next 
 */
module.exports.common_auth=applyEMW(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    req.auth={};

    let authorization:string=req.get('authorization');
    if(!authorization) {
        res.set('WWW-Authenticate','Basic realm="Authorization Required"');
        throw getErr(401,'Authorization Required');
    }
    else{

        let credentials=new Buffer(authorization.split(' ').pop(),'base64').toString('ascii').split(':');
        let found=await redis.hgetAsync(`user:${credentials[0]}:${credentials[1]}`);

        if(found){
            req.auth.id=credentials[0],
            req.auth.name=found.name;
            req.auth.password=found.password;
            // req.auth.gender=found.gender;
            req.auth.type=+(found.type);
            req.auth.avatar=found.avatar;
            next();
        }
        else throw getErr(403,'Access Denied (incorrect credentials)');
    }
 
});