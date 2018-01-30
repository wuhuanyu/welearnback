
const applyEMW=require('../utils/async_middleware');
const getErr=require('../utils/error');
const Teacher=require('../models/models').Teacher;
const Student=require('../models/models').Stu;
const md5=require('md5');
const constants=require('../constants');
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
        if(credentials.length!==3) throw getErr(400,'Wrong format authorization header,read api first');
        let name=credentials[0],pass=credentials[1],type=+credentials[2];
        if(type!==constants.ACC_T_Tea) throw getErr(403,'You are supposed to be a teacher');
        let found=await checkAuth(true,name,pass);
        if(found) {
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            req.auth.gender=found.gender;
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
        let name=credentials[0],pass=credentials[1];
        let found=await checkAuth(false,name,pass);
        // console.log(JSON.stringify(found));
        if(found) {
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            req.auth.gender=found.gender;
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
module.exports.common_auth=applyEMW(async (req,res,next)=>{
    req.auth={};

    let authorization=req.get('authorization');
    if(!authorization) {
        res.set('WWW-Authenticate','Basic realm="Authorization Required"');
        throw getErr(401,'Authorization Required');
    }
    else{
        let credentials=new Buffer(authorization.split(' ').pop(),'base64').toString('ascii').split(':');
        let name=credentials[0],pass=credentials[1],type=+credentials[2];
        let found=await checkAuth(type===constants.ACC_T_Tea,name,pass);
        if(found) {
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            req.auth.gender=found.gender;
            req.auth.type=type;
            next();
        }
        else throw getErr(403,'Access Denied (incorrect credentials)');
    }
 
});