const router = require('express').Router();
import { Question, Comment, Course } from '../models/models';
const getError = require('../utils/error');
const findByFieldFactory = require('../utils/commonquery');
const TAG = "[CourseRouter]: ";
import * as constants from '../constants';
const _File = require('../models/models').UploadFile;
import * as Constants from '../constants';
import { isImage } from '../utils/check';
import { defaultConfig } from '../config/uploadconfig';
import { common_auth } from '../auth/auth_middleware';
import { FT_FILE } from '../constants';
const OP = require('sequelize').Op;
const Teacher = require('../models/models').Teacher;
const TeaCourse = require('../models/models').TeaCourse;
const Student = require('../models/models').Stu;
const errMW = require('../utils/error').errMW;
const applyErrMiddleware = errMW;
const student_auth = require('../auth/auth_middleware').student_auth;
const teacher_auth = require('../auth/auth_middleware').teacher_auth;
const commont_auth = require('../auth/auth_middleware').common_auth;




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
router.post('', defaultConfig, (req, res, next) => {
    let b = req.body;
    // console.log(JSON.stringify(b));
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
    let { start, count } = req.query;
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
 * authentication assumed 
 * req.auth.{tId,name,password}
 * post question of a certain question
 * /23/question
 * TODO: test file upload,image upload 
 */
router.post(/^\/([0-9]+)\/question$/, defaultConfig, (req, res, next) => {
    console.log(TAG);
    let b = req.body, cid = req.params[0];
    let auth = req.auth;
    let files = req.files['upload'];
    //check fields
    if (['type', 'body', 'ans'].every(f => Object.keys(b).indexOf(f) > -1)) {
        let newQ = new Question({
            type: b.type,
            cId: cid,
            tId: req.auth.id,
            body: b.body,
            ans: b.ans,
            time: new Date().getTime(),
        });
        newQ.save().then(savedQ => {
            let savePromsies = files.map(file => {
                let { originalname, size, filename, path } = file;
                let newF = _File.build({
                    aT: Constants.ACC_T_Tea,
                    aId: auth.id,
                    forT: Constants.ForT_Question,
                    fId: savedQ._id,
                    fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
                    original_name: originalname,
                    name: filename,
                    dir: path,
                });
                return newF.save();
            });
            Promise.all(savePromsies).then(saved => {
                res.status(200).json({
                    result: savedQ._id,
                    msg: "Question Upload Successfully"
                })
            });
        }).catch(e => {
            next(getError(500, ""))
        });
    } else {
        next(getError(404, "Wrong Question Format"));
    }
});

/**
 * /12/questions
 * get all questions of 12 course
 * 
 */
router.get(/^\/([0-9]+)\/questions$/, applyErrMiddleware(async (req, res, next) => {
    let cId = req.params[0];
    let questions = await (findByFieldFactory('question', ['cId'], { time: -1 }))([cId]);
    //    console.log(JSON.stringify(questions));
    if (questions.length === 0) throw getError(404, "No such resource");
    let quesitonsWithImage = [];
    for (let q of questions) {
        //cannot add arbitary property to question 
        let images = await getImageNames({ fId: +q._id, forT: Constants.ForT_Question });
        let obj = q.toObject();
        obj.images = images;
        quesitonsWithImage.push(obj);
    }
    res.json({
        count: questions.length,
        data: quesitonsWithImage
    })
}));


/**
 * 
 *  /12/12/comment
 * TODO: test  ,
 */
router.post(/^\/([0-9]+)\/(w+)\/comment$/, common_auth, defaultConfig, applyErrMiddleware(async (req, res, next) => {
    let c = req.params[0], q = req.params[1], author_type = req.auth.type;
    if (!(Comment.checkedFiles.every(f => req.body.indexOf(f) > -1)))
        throw getError(400, "Wrong comment error");

    if ('body' in req.body) {
        let body = req.body;
        let newC = new Comment({
            forT: constants.ForT_Question,
            forId: q,
            //must have type
            aT: author_type,
            aId: req.auth.id,
            body: body.body,
            time: new Date().getTime()
        });
        let savedC = await newC.save();

        /**
         * upload file processing
         */
        let files = req.files['upload']
        let savedFiles = [];
        if (files && (files.length !== 0)) {
            //there is file
            for (let file of files) {
                let { originalname, size, filename, path } = file;
                let newF = _File.build({
                    aT: author_type,
                    aId: req.auth.id,
                    forT: constants.ForT_Question,
                    fId: q,
                    fT: (isImage(originalname) ? constants.FT_IMAGE : constants.FT_IMAGE),
                    original_name: originalname,
                    name: filename,
                    dir: path
                });
                savedFiles.push(await newF.saved());
            }
        };
        //if there is file,
        if (files && (files.length !== 0)) {
            //check if every files saved;
            if (files.length === savedFiles === 0) {
                res.status(200).json({
                    msg: "Comment Successfully!",
                    result: savedC.id,
                });
            }
            else getError(500, "Something happens when storing file");
        }
        else {
            res.status(200).json({
                msg: "Comment Successfully!",
                result: savedC.id,
            });
        }

    }
}));

/**
 * /course/question/comments
 * /12/24/comments
 * get all comments of a question of a course
 */
router.get(/^\/([0-9]+)\/([0-9]+)\/comments$/, applyErrMiddleware(async (req, res, next) => {
    let c = req.params[0], q = req.params[1];
    let comments = await findByFieldFactory('comment', ['qId', 'cId'], { time: 1 })([q, c]);
    if (comments.length === 0) throw getError(400, "No such resource");
    let datas = [];
    for (let comment of comments) {
        let aT = comment.aT;
        let aId = comment.aId;
        let user = (aT === constants.ACC_T_Tea ? Teacher : Student);
        let userFound = await user.findById(aId);
        let data = comment.toJSON();
        let images = await getImageNames({ forT: constants.ForT_Comment, fId: comment._id });
        data.aName = userFound.name;
        data.images = images;
        datas.push(data);
    }
    res.json({
        count: datas.length,
        data: datas
    });
}));
export default router;

export {getImageNames};