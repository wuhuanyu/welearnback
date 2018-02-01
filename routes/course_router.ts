const router = require('express').Router();
// import { Question, Comment, Course } from '../models/models';
const models=require('../models/models');
const Question=models.Question,Comment=models.Comment,Course=models.Course;
const getError = require('../utils/error');
const findByFieldFactory = require('../utils/commonquery');
const TAG = "[CourseRouter]: ";
// import * as constants from '../constants';
const constants=require('../constants');
const _File = require('../models/models').UploadFile;
const Constants=constants;
// import * as Constants from '../constants';
import { isImage } from '../utils/check';
import { defaultConfig } from '../config/uploadconfig';
import { common_auth } from '../auth/auth_middleware';
import { FT_FILE } from '../constants';
import { Buffer } from 'buffer';
const OP = require('sequelize').Op;
const Teacher = require('../models/models').Teacher;
const TeaCourse = require('../models/models').TeaCourse;
const Student = require('../models/models').Stu;
const errMW = require('../utils/error').errMW;
const applyErrMiddleware = errMW;
const student_auth = require('../auth/auth_middleware').student_auth;
const teacher_auth = require('../auth/auth_middleware').teacher_auth;
const commont_auth = require('../auth/auth_middleware').common_auth;
const uuid = require('uuid/v1');
const md5=require('md5');
const _globals=require('../globals');
import * as express from 'express';


const getTeacherName = async (options) => {
    let { tId } = options;
    let teacher = await Teacher.findOne({ where: { id: tId }, attributes: ['name'] });
    return teacher.name;
};

const courseToTeacher = async (options) => {
    let { cId } = options;
    let teacourse = await TeaCourse.findOne({ where: { cId: cId }, attributes: ['tId'] });
    console.log(teacourse.toJSON());
    let teaId = teacourse.tId;
    let name = await getTeacherName({ tId: teaId });
    return name;
};

/**
 * 
 * @param {Object} options 
 */
const getImageNames = async (options) => {
    let { forT, fId } = options;
    console.log(fId);
    let images = await _File.findAll({
        where: { forT: forT, fId: fId, fT: Constants.FT_IMAGE },
        attributes: ['name']
    });
    let imageNames = [];
    for (let im of images) {
        imageNames.push(im.name);
    }
    return imageNames;
}




/**
 * tested
 * 
 */
router.post('', teacher_auth, defaultConfig, (req, res, next) => {
    let b = req.body;
    let files = req.files['upload'], auth = req.auth;
    if (['name', 'desc'].every(f => {
        return Object.keys(b).indexOf(f) > -1;
    })) {
        let n = b.name, d = b.desc;
        let newC = Course.build({
            name: n,
            desc: d,
        });
        newC.save().then(savedC => {
            let savePromsies = files.map(file => {
                let { originalname, size, filename, path } = file;
                let newF = _File.build({
                    aT: Constants.ACC_T_Tea,
                    aId: auth.id,
                    forT: Constants.ForT_Course,
                    fId: savedC.id,
                    fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
                    original_name: originalname,
                    name: filename,
                    dir: path,
                });
                return newF.save();
            });
            Promise.all(savePromsies).then(saved => {
                res.status(200).json({
                    result: savedC.id,
                    msg: "Course Uploaded Successfully"
                });
            });
        });
    } else {
        next(getError(400, "Course Wrong Format"));
    }
});

/**
 * /api/v1/course/:id
 */

router.get(/^\/([0-9]+)$/, errMW(async (req, res, next) => {
    let id = req.params[0];
    let course = await Course.findById(+id);
    if (!course) throw getError(400, "No such resource");
    let courseFound = course.toJSON();
    let images = await getImageNames({ fT: Constants.FT_FILE, fId: course.id, forT: Constants.ForT_Course });
    courseFound.images = images;
    let teacher = await courseToTeacher({ cId: course.id });
    courseFound.teacher = teacher;
    res.json({
        count: 1,
        data: courseFound,
    });
}));

/**
 * tested
 * http://localhost:3000/api/v1/course?name=Art
 */
router.get('', applyErrMiddleware(async (req, res, next) => {
    let n = req.query.name;
    let course = await Course.findOne({ where: { name: n } });
    if (!course) throw getError(404, "No such resource");
    let images = await getImageNames({ fT: Constants.FT_FILE, fId: course.id, forT: Constants.ForT_Course });
    let courseFound = course.toJSON();
    courseFound.images = images;
    let teacher = await courseToTeacher({ cId: course.id });
    courseFound.teacher = teacher;
    res.json({
        count: 1,
        data: courseFound,
    });
}));



/**
 * get /course/all
 */

router.get('/all', applyErrMiddleware(async (req, res, next) => {
    // let { start, count } = req.query;
    let start=req.query['start']||0,count=req.query['count']||Number.MAX_SAFE_INTEGER;
    let coursesFound = await Course.findAll({
        where: { id: { [OP.between]: [start, start + count] } },
    });
    if (coursesFound.length === 0) throw getError(404, "No more resources");
    let courses = coursesFound.map(c => c.toJSON());
    for (let c of courses) {
        let imagesFound = await getImageNames({ forT: Constants.ForT_Course, fId: c.id });
        let teacher = await courseToTeacher({ cId: c.id });
        c.images = imagesFound;
        c.teacher = teacher;
    }
    res.json({
        count: courses.length,
        data: courses
    })
}));


/**
 * get comment of a course
 * /course/12/comments
 */
router.get(/^\/([0-9]+)\/comment$/,applyErrMiddleware(async (req,res,next)=>{
    let course_id=req.params[0];
    let start=+req.query.start||0,limit=+req.query.limit||5;
    // let comments=await findByFieldFactory('comment',['forT','forId'])([Constants.ForT_Course,course_id]);
    let comments=await models.Comment.find({forT:constants.ForT_Course,forId:course_id}).where('_id').gt(start-1).limit(limit);
    if(comments.length===0) throw getError(404,"No such resource");
    let datas=[];
    let next_start=-1;
    for(let [idx,comment] of comments.entries()){
        let author=(comment.aT===constants.ACC_T_Stu?models.Stu:models.Teacher);
        let _author=(await author.findById(comment.aId));
        let c=comment.toObject();
        c._id=comment._id;
        c.author=_author.name;
        c.avatar=_author.avatar;
        datas.push(c);
        if((idx===comments.length-1)){
            next_start=+comment._id+1;
        }
    }
        res.json({
            count:datas.length,
            next:next_start,
            data:datas,
        });
}));

/**
 *  TODO:add image support
 */

 router.post(/^\/([0-9]+)\/comment$/,common_auth,applyErrMiddleware(async (req,res,next)=>{
     let auth=req.auth,is_teacher=auth.type===constants.ACC_T_Tea;
     let course_id=req.params[0];
     let time=new Date().getTime();
     let saved=  await new models.Comment({
         forT:constants.ForT_Course,
         forId:course_id,
         aT:auth.type,
         aId:auth.id,
         time:time,
         body:req.body.body,
     }).save();
     if(saved){
         _globals.mqtt_client.publish(`${course_id}`,JSON.stringify({
             type:constants.new_comment_course_by_teacher,
             payload:saved,
         }))
         res.json({
             result:saved.id,
             msg:'Comment successfully'
         });
     };
 }));



router.get(/^\/([0-9]+)\/users$/,applyErrMiddleware(async (req,res,next)=>{
    let course_id=req.params[0];
    let stu_courses=await models.StuCourse.findAll({where:{cId:course_id},attributes:['sId']});
    if(stu_courses.length===0) throw getError(404,"No such resources");
    let tea_courses=await models.TeaCourse.findAll({where:{cId:course_id},attributes:['tId']});

    let datas=[];
    for(let tea of tea_courses){
        let teacher =await models.Teacher.findOne({where:{id:tea.tId},attributes:['id','name','gender']});
        teacher=teacher.toJSON();
        teacher.type=Constants.ACC_T_Tea;
        datas.push(teacher);
    }
    for(let stu of stu_courses){
        let student_id=stu.sId;
        let student= await models.Stu.findOne({where:{id:student_id},attributes:['id','name','gender']});
        student=student.toJSON();
        student.type=Constants.ACC_T_Stu;
        datas.push(student);
    }
    res.set({
        'Cache-Control':`max-age=${10*60}`
    });
    res.json({
        count:datas.length,
        data:datas
    });
}));


router.use(/^\/([0-9]+)\/question/,(req,res,next)=>{
    req.url_params={};
    req.url_params.course_id=req.params[0];
    next();
},require('./question_router'));

router.use(/^\/([0-9]+)\/bulletin$/,(req,res,next)=>{
    req.url_params={
        course_id:req.params[0],
    }
    next();
},
require('./bulletin_router'));
//TODO:check teacher or student selected the course;
router.use(/^\/([0-9]+)\/message$/,common_auth,(req,res,next)=>{
    next();
},(req,res,next)=>{
   req.url_params={
        course_id:req.params[0],
    };

    //get /course/1/message?before=:time&after=:time&count:=num
    req.url_queries={}
    Object.keys(req.query).forEach(k=>{
        req.url_queries[k]=req.query[k];
    });
    next();
},require('./message_router'));




router.use(/^\/([0-9]+)\/video/,(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    req.url_params=req.url_params||{};
    req.url_params.course_id=req.params[0];
    next();
},require('./video_router'));


export default router;
export {getImageNames};