"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const models = require('../models/models');
const Question = models.Question, Comment = models.Comment, Course = models.Course;
const getError = require('../utils/error');
const findByFieldFactory = require('../utils/commonquery');
const TAG = "[CourseRouter]: ";
const constants = require('../constants');
const _File = require('../models/models').UploadFile;
const Constants = constants;
const check_1 = require("../utils/check");
const uploadconfig_1 = require("../config/uploadconfig");
const auth_middleware_1 = require("../auth/auth_middleware");
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
const md5 = require('md5');
const _globals = require('../globals');
const push = require('../globals').mqtt_client;
const getTeacherName = (options) => __awaiter(this, void 0, void 0, function* () {
    let { tId } = options;
    let teacher = yield Teacher.findOne({ where: { id: tId }, attributes: ['name'] });
    return teacher.name;
});
const courseToTeacher = (options) => __awaiter(this, void 0, void 0, function* () {
    let { cId } = options;
    let teacourse = yield TeaCourse.findOne({ where: { cId: cId }, attributes: ['tId'] });
    console.log(teacourse.toJSON());
    let teaId = teacourse.tId;
    let name = yield getTeacherName({ tId: teaId });
    return name;
});
const getImageNames = (options) => __awaiter(this, void 0, void 0, function* () {
    let { forT, fId } = options;
    console.log(fId);
    let images = yield _File.findAll({
        where: { forT: forT, fId: fId, fT: Constants.FT_IMAGE },
        attributes: ['name']
    });
    let imageNames = [];
    for (let im of images) {
        imageNames.push(im.name);
    }
    return imageNames;
});
exports.getImageNames = getImageNames;
router.post('', teacher_auth, uploadconfig_1.defaultConfig, (req, res, next) => {
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
                    fT: (check_1.isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
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
    }
    else {
        next(getError(400, "Course Wrong Format"));
    }
});
router.get(/^\/([0-9]+)$/, errMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let id = req.params[0];
    let course = yield Course.findById(+id);
    if (!course)
        throw getError(400, "No such resource");
    let courseFound = course.toJSON();
    let images = yield getImageNames({ fT: Constants.FT_FILE, fId: course.id, forT: Constants.ForT_Course });
    courseFound.images = images;
    let teacher = yield courseToTeacher({ cId: course.id });
    courseFound.teacher = teacher;
    res.json({
        count: 1,
        data: courseFound,
    });
})));
router.get('', applyErrMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let n = req.query.name;
    let course = yield Course.findOne({ where: { name: n } });
    if (!course)
        throw getError(404, "No such resource");
    let images = yield getImageNames({ fT: Constants.FT_FILE, fId: course.id, forT: Constants.ForT_Course });
    let courseFound = course.toJSON();
    courseFound.images = images;
    let teacher = yield courseToTeacher({ cId: course.id });
    courseFound.teacher = teacher;
    res.json({
        count: 1,
        data: courseFound,
    });
})));
router.get('/all', applyErrMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let start = req.query['start'] || 0, count = req.query['count'] || Number.MAX_SAFE_INTEGER;
    let coursesFound = yield Course.findAll({
        where: { id: { [OP.between]: [start, start + count] } },
    });
    if (coursesFound.length === 0)
        throw getError(404, "No more resources");
    let courses = coursesFound.map(c => c.toJSON());
    for (let c of courses) {
        let imagesFound = yield getImageNames({ forT: Constants.ForT_Course, fId: c.id });
        let teacher = yield courseToTeacher({ cId: c.id });
        c.images = imagesFound;
        c.teacher = teacher;
    }
    res.json({
        count: courses.length,
        data: courses
    });
})));
router.get(/^\/([0-9]+)\/comment$/, applyErrMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.params[0];
    let start = +req.query.start || 0, limit = +req.query.limit || 5;
    let comments = yield models.Comment.find({ forT: constants.ForT_Course, forId: course_id }).where('_id').gt(start - 1).limit(limit);
    if (comments.length === 0)
        throw getError(404, "No such resource");
    let datas = [];
    let next_start = -1;
    for (let [idx, comment] of comments.entries()) {
        let author = (comment.aT === constants.ACC_T_Stu ? models.Stu : models.Teacher);
        let _author = (yield author.findById(comment.aId));
        let c = comment.toObject();
        c._id = comment._id;
        c.author = _author.name;
        c.avatar = _author.avatar;
        datas.push(c);
        if ((idx === comments.length - 1)) {
            next_start = +comment._id + 1;
        }
    }
    res.json({
        count: datas.length,
        next: next_start,
        data: datas,
    });
})));
router.post(/^\/([0-9]+)\/comment$/, auth_middleware_1.common_auth, applyErrMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let auth = req.auth, is_teacher = auth.type === constants.ACC_T_Tea;
    let course_id = parseInt(req.params[0], 10);
    let time = new Date().getTime();
    let saved = yield new models.Comment({
        forT: constants.ForT_Course,
        forId: course_id,
        aT: auth.type,
        aId: auth.id,
        time: time,
        body: req.body.body,
    }).save();
    if (saved) {
        let data = saved.toObject();
        data.course_name = (yield models.Course.findOne({ _id: course_id })).name;
        _globals.mqtt_client.publish(`${course_id}`, JSON.stringify({
            type: constants.new_comment_course,
            payload: data,
        }));
        res.json({
            result: saved.id,
            msg: 'Comment successfully'
        });
    }
    ;
})));
router.get(/^\/([0-9]+)\/users$/, applyErrMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.params[0];
    let stu_courses = yield models.StuCourse.findAll({ where: { cId: course_id }, attributes: ['sId'] });
    if (stu_courses.length === 0)
        throw getError(404, "No such resources");
    let tea_courses = yield models.TeaCourse.findAll({ where: { cId: course_id }, attributes: ['tId'] });
    let datas = [];
    for (let tea of tea_courses) {
        let teacher = yield models.Teacher.findOne({ where: { id: tea.tId }, attributes: ['id', 'name', 'gender'] });
        teacher = teacher.toJSON();
        teacher.type = Constants.ACC_T_Tea;
        datas.push(teacher);
    }
    for (let stu of stu_courses) {
        let student_id = stu.sId;
        let student = yield models.Stu.findOne({ where: { id: student_id }, attributes: ['id', 'name', 'gender'] });
        student = student.toJSON();
        student.type = Constants.ACC_T_Stu;
        datas.push(student);
    }
    res.set({
        'Cache-Control': `max-age=${10 * 60}`
    });
    res.json({
        count: datas.length,
        data: datas
    });
})));
router.use(/^\/([0-9]+)\/question/, (req, res, next) => {
    req.url_params = {};
    req.url_params.course_id = req.params[0];
    next();
}, require('./question_router'));
router.use(/^\/([0-9]+)\/bulletin$/, (req, res, next) => {
    req.url_params = {
        course_id: req.params[0],
    };
    next();
}, require('./bulletin_router'));
router.use(/^\/([0-9]+)\/message$/, auth_middleware_1.common_auth, (req, res, next) => {
    next();
}, (req, res, next) => {
    req.url_params = {
        course_id: req.params[0],
    };
    req.url_queries = {};
    Object.keys(req.query).forEach(k => {
        req.url_queries[k] = req.query[k];
    });
    next();
}, require('./message_router'));
router.use(/^\/([0-9]+)\/video/, (req, res, next) => {
    req.url_params = req.url_params || {};
    req.url_params.course_id = req.params[0];
    next();
}, require('./video_router'));
exports.default = router;
