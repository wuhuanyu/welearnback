const router = require('express').Router();
const getError = require('../utils/error');
const md5 = require('md5');
const Comment = require('../models/models').Comment;
const Stu = require('../models/models').Stu;
const Teacher = require('../models/models').Teacher;
const StuCourse = require('../models/models').StuCourse;
const TC = require('../models/models').TeaCourse;
import * as constants from '../constants';
import { ACC_T_Stu, ACC_T_Tea } from '../constants';
const applyEMW = require('../utils/error').errMW;
import {getImageNames} from './course_router';
const Course = require('../models/models').Course;
const TAG = "[AccRouter]: ";
const TeaCourse=require('../models/models').TeaCourse;
//TODO: signUp utility
const signUp = (type, name, password, gender) => {
    let user = type === constants.ACC_T_Stu ? Stu : Teacher;

    //check fields must have name,password,gender
    //student teacher must have checkedfields
    if (user.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = name, p = password, g = gender;//assume gender is a number,uncheck
        user.findOne({ where: { name: n } }).then(founded => {
            if (founded) {
                return Promise.reject(getError(400, "Name exsits already"));
            } else {
                let newUser = user.build({
                    name: n,
                    password: md5(p),
                    gender: +g,
                });
                newUser.save().then(savedUser => {
                    res.status(200).json({
                        result: savedUser.id,
                        msg: "SignUp Succesfully",
                    });
                }).catch(e => next(getError(500, e.message)));
            }
        }).catch(e => {
            next(getError(500, e.message));
        })
    } else {
        next(getError(400, "Wrong format for Stu signup"));
    }

}

/**
 * login
 * /acc
 */
router.post('', (req, res, next) => {
    let uBody = req.body, name = uBody.name, password = md5(uBody.password), type = +uBody.type;
    let user = (type === ACC_T_Stu ? Stu : Teacher);
    user.findOne({ where: { name: name } }).then(found => {
        //no such user
        if (!found) {
            next(getError(404, "No such user"));
        } else {
            //wrong password
            if (found.password != password) {
                next(getError(401, "Wrong password"));
            }
            //login ok
            else {
                res.status(200).json({
                    result: found.id,
                    msg: "Login Successfully"
                });
            }
        }

    });
});

/**
 * student signup
 */
router.post('/stu', (req, res, next) => {
    let uBody = req.body;
    let keys = Object.keys(uBody);
    //check fields must have name,password,gender
    if (Stu.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = uBody.name, p = uBody.password, g = uBody.gender;//assume gender is a number,uncheck
        Stu.findOne({ where: { name: n } }).then(stuFind => {
            if (stuFind) {
                next(getError(400, "Name exsits already"));
            } else {
                let newStu = Stu.build({
                    name: n,
                    password: md5(p),
                    gender: +g,
                });
                newStu.save().then(savedStu => {
                    res.status(200).json({
                        result: savedStu.id,
                        msg: "SignUp Succesfully",
                    });
                }).catch(e => next(getError(500, e.message)));
            }
        }).catch(e => {
            next(getError(500, e.message));
        })
    } else {
        next(getError(400, "Wrong format for Stu signup"));
    }
});

/**
 * update
 */
router.put('/stu', (req, res, next) => {
});

/**
 * post cours 
 * /stu/13/course
 * add course of 13  req.body.{
 *    cs:[12,23,54],
 * }
 * 
 */

router.post(/^\/stu\/([0-9]+)\/course$/, applyEMW(async (req, res, next) => {
    let cS = req.body.cs, sID = req.params[0];
    if(!cS) throw getError(400,"Bad request,read api first");
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
router.get(/^\/stu\/([0-9]+)\/course$/, (req, res, next) => {
    let sID = req.params[0];
    console.log(TAG + sID);
    StuCourse.findAll({ where: { sId: sID } }).then(datas => {
        if (datas.length != 0) {
            res.status(200).json({
                count: datas.length,
                data: datas,
            })
        } else {
            next(getError(404, "Not found"));
        }
    }).catch(e => {
        next(getError(400, e.message));
    });
});


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
 * TODO: check if exists; 
 * tested
 */
router.post('/tea/:id/course', (req, res, next) => {
    let cIDs = req.body.cs, tID = req.params.id;
    if (Array.isArray(cIDs)) {
        let savedPromsie = cIDs.map(cid => {
            let newTC = TC.build({
                tId: tID,
                cId: cid,
            });
            return newTC.save();
        });
        Promise.all(savedPromsie).then((saved) => {
            res.status(200).json({
                msg: "Course Selected Successfully"
            });
        }).catch(e => {
            next(getError(400, e.message));
        })
    } else {
        //    next(getError(400,"cs must be array"));
    }
})


/**
 * get /tea/1/course
 * 
 */

 router.get(/^\/tea\/([0-9]+)\/course$/,applyEMW(async (req,res,next)=>{
     let tID=req.params[0];
     let teaCourseFounds=await TeaCourse.findAll({where:{tId:tID},attributes:['cId']});
     let courseIds=[];
     let data=[];
     for(let tc of teaCourseFounds){
         let cId=tc.cId;
         let course=await Course.findOne({where:{id:cId}});
         course=course.toJSON();
         let imagesFound= await getImageNames({fId:cId,forT:constants.ForT_Course});
         course.images=imagesFound;
         data.push(course);
     }
     res.json({
         count:data.length,
         data:data,
     })
 }));

module.exports=router;