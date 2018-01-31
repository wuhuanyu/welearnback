const router = require('express').Router();
const getError = require('../utils/error');
const md5 = require('md5');
const Comment = require('../models/models').Comment;
const Stu = require('../models/models').Stu;
const Teacher = require('../models/models').Teacher;
const StuCourse = require('../models/models').StuCourse;
const TC = require('../models/models').TeaCourse;
// import * as constants from '../constants';
const constants = require('../constants');
import { ACC_T_Stu, ACC_T_Tea } from '../constants';
const applyEMW = require('../utils/error').errMW;
import { getImageNames } from './course_router';
import { teacher_auth, student_auth } from '../auth/auth_middleware';
const Course = require('../models/models').Course;
const TAG = "[AccRouter]: ";
const TeaCourse = require('../models/models').TeaCourse;
const stu_auth = require('../auth/auth_middleware').student_auth;
import avatar_middleware from '../config/avatar.config';
import * as express from 'express';
import * as fs from 'fs-extra';
import * as multer from 'multer';
import { reset } from '_@types_continuation-local-storage@3.2.1@@types/continuation-local-storage';
/**
 * login
 * /acc
 */
router.post('', applyEMW(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let uBody = req.body, name = uBody.name, password:string = md5(uBody.password), type:number = +uBody.type, action:string = uBody.action;
    if (!action.toLowerCase() in ['login', 'logout'])
        throw getError(404, "Illegal action");
    let user = (type === ACC_T_Stu ? Stu : Teacher);
    let found = await user.findOne({ where: { name: name, password: password } });
    let updated;
    if (!found) throw getError(401, "Wrong credentials");
    else updated = await found.update({
        login: action === 'login'
    });
    res.status(200).json({
        result: updated.id,
        msg: `${action} successfully`
    });
}));

/**
 * student signup
 */
router.post('/stu', avatar_middleware, applyEMW(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let uBody = req.body;
    let keys = Object.keys(uBody); let file: Express.Multer.File = req.file;
    //check fields must have name,password,gender
    if (Stu.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = uBody.name, p = uBody.password, g = uBody.gender;//assume gender is a number,uncheck
        let stuFind = await Stu.findOne({ where: { name: n } });
        if (stuFind) {
            if (file != null) {
                try{
                    await fs.unlink(file.destination+'/'+file.filename);
                }catch(e){
                    
                }
            }
            throw getError(400, "Name exsits already");
        }
        else {
            let newStu = await Stu.build({
                name: n,
                password: md5(p),
                gender: +g,
                avatar:file.filename,
            }).save();
            res.json({
                msg:'Sign up ok',
                result:newStu.id,
            })
        }
    } else {
        next(getError(400, "Wrong format for Stu signup"));
    }
}));

/**
 * updata
 * TODO: update profile 
 */
router.put('/stu',avatar_middleware,stu_auth,applyEMW(async(req:express.Request,res:express.Response,next:express.NextFunction) => {
    let body=req.body;
    let new_password=body['new_password'];
    //upload avatar
    if(req.file){
        let found=await Stu.findOne({where:{id:req.auth.id}});
        await found.update({
            avatar:req.file.filename,
        });
        res.json({
            msg:'Avatar update Ok',
            result:found.id
        });
    }
}));

/**
 * post cours 
 * /stu/13/course
 * add course of 13  req.body.{
 *    cs:[12,23,54],
 * }
 * 
 */
router.post(/^\/stu\/([0-9]+)\/course$/, stu_auth, applyEMW(async (req, res, next) => {
    // console.log(req.auth);
    let cS = req.body.cs, sID = req.params[0];
    if (!cS) throw getError(400, "Bad request,read api first");
    if (!Array.isArray(cS)) throw getError(400, "Request body invalid");
    let results = [];
    for (let cid of cS) {
        if (cid) {
            let foundRecord = await StuCourse.findOne({ where: { sId: sID, cId: +cid } });
            if (foundRecord) throw getError(400, "Record exists already");
            let result = await StuCourse.build({ sId: sID, cId: cid }).save();
            results.push(result);
        }
    }
    if (results.length === cS.length) {
        res.json({
            msg: "Record inserted successfully"
        });
    }
}));

/**
 * get course of 13
 * /stu/12/course
 * tested
 */
router.get(/^\/stu\/([0-9]+)\/course$/,stu_auth, applyEMW(async (req, res, next) => {
    let sID = req.params[0];
    let stu_courses = await StuCourse.findAll({ where: { sId: sID }, attributes: ['sId', 'cId'] });
    if (stu_courses.length === 0) throw getError(404, "You have not select courses");
    let courseIds = [];
    let datas = [];
    for (let sc of stu_courses) {
        let cId = sc.cId;
        let course = await Course.findOne({ where: { id: cId } });
        course = course.toJSON();
        let imagesFound = await getImageNames({ fId: cId, forT: constants.ForT_Course });
        course.images = imagesFound;
        datas.push(course);
    }
    res.json({
        count: stu_courses.length,
        data: datas
    })
}));


/**
 * delete /stu/13/course
 * drop a course of student 13
 */
router.delete(/^\/stu\/([0-9]+)\/course$/, (req, res, next) => {

});




/**
 * tested 
 * teacher signup 
 */

router.post('/tea', (req, res, next) => {
    let uBody = req.body;
    let keys = Object.keys(uBody);
    //check fields must have name,password,gender
    if (Teacher.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = uBody.name, p = uBody.password, g = uBody.gender;//assume gender is a number,uncheck
        Teacher.findOne({ where: { name: n } }).then(teaFound => {
            if (teaFound) {
                next(getError(400, "Name exsits already"));
            } else {
                let newTea = Teacher.build({
                    name: n,
                    password: md5(p),
                    gender: +g,
                });
                newTea.save().then(savedTea => {
                    res.status(200).json({
                        result: savedTea.id,
                        msg: "SignUp Succesfully",
                    });
                }).catch(e => next(getError(500, e.message)));
            }
        }).catch(e => {
            next(getError(500, e.message));
        })
    } else {
        next(getError(400, "Wrong format for Teacher signup"));
    }
});

/**
 * TODO:get infomation of a teacher;
 */
router.get('/tea/:id', (req, res, next) => {

});

/**
 * add course to teacher with id 1 
 * post /tea/1/course req.body.{cs:[1,2,3]}
 * tested
 */
router.post('/tea/:id/course', teacher_auth, applyEMW(async (req, res, next) => {
    let cS = req.body.cs, tID = req.params.id;
    if (!cS) throw getError(400, "Bad request,read api first");
    if (!Array.isArray(cS)) throw getError(400, "Request body invalid");
    let results = [];
    for (let cid of cS) {
        if (cid) {
            let foundRecord = await TeaCourse.findOne({ where: { tId: tID, cId: +cid } });
            if (foundRecord) throw getError(400, "Record exists already");
            let result = await TeaCourse.build({ tId: tID, cId: cid }).save();
            results.push(result);
        }
    }
    if (results.length === cS.length) {
        res.json({
            msg: "Record inserted successfully"
        });
    }
}));


/**
 * get /tea/1/course
 * 
 */

router.get(/^\/tea\/([0-9]+)\/course$/, applyEMW(async (req, res, next) => {
    let tID = req.params[0];
    let teaCourseFounds = await TeaCourse.findAll({ where: { tId: tID }, attributes: ['cId'] });
    let courseIds = [];
    let data = [];
    for (let tc of teaCourseFounds) {
        let cId = tc.cId;
        let course = await Course.findOne({ where: { id: cId } });
        course = course.toJSON();
        let imagesFound = await getImageNames({ fId: cId, forT: constants.ForT_Course });
        course.images = imagesFound;
        data.push(course);
    }
    res.json({
        count: data.length,
        data: data,
    })
}));

module.exports=router;