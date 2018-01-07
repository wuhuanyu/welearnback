const applyEMW=require('../utils/error');
const getErr=require('../utils/error');
const Teacher=require('../models/models').Teacher;
const Student=require('../models/models').Student;
const md5=require('md5');
/**
 * basic auth 
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 */

const checkAuth=async (isTeacher,name,pass)=>{
    let user=isTeacher?Teacher:Student;
    let found= await user.findOne({where:{name:name,password:md5(password)},attri});
    return found;
}
const teacher_auth=applyEMW(async (req,res,next)=>{
    req.auth={};
    let authorization=req.get('authorization');
    if(!authorization) {
        res.set('WWW-Authenticate',"Basic realm=\"Authorization Required\"")
        throw getErr(401,"Authorization Required");
        // res.status(401).send("Authorization Required");
    }
    else{
        credentials=new Buffer(authorization.split(" ").pop(),"base64").toString("ascii").split(":");
        let name=credentials[0],pass=credentials=[1];
        let found=await checkAuth(true,name,pass);
        console.log(JSON.stringify(found));
        if(found) {
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            req.auth.gender=found.gender;
            next();
        }
        else throw getErr(403,"Access Denied (incorrect credentials)");
    }
});

/**
 * 之所以分开写，是考虑到将来 老师的验证可能需要更复杂的逻辑
 */
const student_auth=applyEMW(async (req,res,next)=>{
 req.auth={};
    let authorization=req.get('authorization');
    if(!authorization) {
        res.set('WWW-Authenticate',"Basic realm=\"Authorization Required\"")
        throw getErr(401,"Authorization Required");
        // res.status(401).send("Authorization Required");
    }
    else{
        credentials=new Buffer(authorization.split(" ").pop(),"base64").toString("ascii").split(":");
        let name=credentials[0],pass=credentials=[1];
        let found=await checkAuth(true,name,pass);
        console.log(JSON.stringify(found));
        if(found) {
            req.auth.id=found.id;
            req.auth.name=found.name;
            req.auth.password=found.password;
            req.auth.gender=found.gender;
            next();
        }
        else throw getErr(403,"Access Denied (incorrect credentials)");
    }
});
module.exports={
    teacher_auth,
}