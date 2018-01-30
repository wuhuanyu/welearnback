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
const getError = require('../utils/error');
const md5 = require('md5');
const Comment = require('../models/models').Comment;
const Stu = require('../models/models').Stu;
const Teacher = require('../models/models').Teacher;
const StuCourse = require('../models/models').StuCourse;
const TC = require('../models/models').TeaCourse;
const constants = require('../constants');
const constants_1 = require("../constants");
const applyEMW = require('../utils/error').errMW;
const course_router_1 = require("./course_router");
const auth_middleware_1 = require("../auth/auth_middleware");
const Course = require('../models/models').Course;
const TAG = "[AccRouter]: ";
const TeaCourse = require('../models/models').TeaCourse;
const stu_auth = require('../auth/auth_middleware').student_auth;
const avatar_config_1 = require("../config/avatar.config");
const fs = require("fs-extra");
router.post('', applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let uBody = req.body, name = uBody.name, password = md5(uBody.password), type = +uBody.type, action = uBody.action;
    if (!action.toLowerCase() in ['login', 'logout'])
        throw getError(404, "Illegal action");
    let user = (type === constants_1.ACC_T_Stu ? Stu : Teacher);
    let found = yield user.findOne({ where: { name: name, password: password } });
    let updated;
    if (!found)
        throw getError(401, "Wrong credentials");
    else
        updated = yield found.update({
            login: action === 'login'
        });
    res.status(200).json({
        result: updated.id,
        msg: `${action} successfully`
    });
})));
router.post('/stu', avatar_config_1.default, applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let uBody = req.body;
    let keys = Object.keys(uBody);
    let file = req.file;
    if (Stu.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = uBody.name, p = uBody.password, g = uBody.gender;
        let stuFind = yield Stu.findOne({ where: { name: n } });
        if (stuFind) {
            if (file != null) {
                try {
                    yield fs.unlink(file.destination);
                }
                catch (e) {
                }
            }
            throw getError(400, "Name exsits already");
        }
        else {
            let newStu = yield Stu.build({
                name: n,
                password: md5(p),
                gender: +g,
                avatar: file.filename,
            }).save();
        }
    }
    else {
        next(getError(400, "Wrong format for Stu signup"));
    }
})));
router.put('/stu', avatar_config_1.default, stu_auth, applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let body = req.body;
    let new_password = body['new_password'];
})));
router.post(/^\/stu\/([0-9]+)\/course$/, stu_auth, applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let cS = req.body.cs, sID = req.params[0];
    if (!cS)
        throw getError(400, "Bad request,read api first");
    if (!Array.isArray(cS))
        throw getError(400, "Request body invalid");
    let results = [];
    for (let cid of cS) {
        if (cid) {
            let foundRecord = yield StuCourse.findOne({ where: { sId: sID, cId: +cid } });
            if (foundRecord)
                throw getError(400, "Record exists already");
            let result = yield StuCourse.build({ sId: sID, cId: cid }).save();
            results.push(result);
        }
    }
    if (results.length === cS.length) {
        res.json({
            msg: "Record inserted successfully"
        });
    }
})));
router.get(/^\/stu\/([0-9]+)\/course$/, auth_middleware_1.student_auth, applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let sID = req.params[0];
    let stu_courses = yield StuCourse.findAll({ where: { sId: sID }, attributes: ['sId', 'cId'] });
    if (stu_courses.length === 0)
        throw getError(404, "You have not select courses");
    let courseIds = [];
    let datas = [];
    for (let sc of stu_courses) {
        let cId = sc.cId;
        let course = yield Course.findOne({ where: { id: cId } });
        course = course.toJSON();
        let imagesFound = yield course_router_1.getImageNames({ fId: cId, forT: constants.ForT_Course });
        course.images = imagesFound;
        datas.push(course);
    }
    res.json({
        count: stu_courses.length,
        data: datas
    });
})));
router.delete(/^\/stu\/([0-9]+)\/course$/, (req, res, next) => {
});
router.post('/tea', (req, res, next) => {
    let uBody = req.body;
    let keys = Object.keys(uBody);
    if (Teacher.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = uBody.name, p = uBody.password, g = uBody.gender;
        Teacher.findOne({ where: { name: n } }).then(teaFound => {
            if (teaFound) {
                next(getError(400, "Name exsits already"));
            }
            else {
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
        });
    }
    else {
        next(getError(400, "Wrong format for Teacher signup"));
    }
});
router.get('/tea/:id', (req, res, next) => {
});
router.post('/tea/:id/course', auth_middleware_1.teacher_auth, applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let cS = req.body.cs, tID = req.params.id;
    if (!cS)
        throw getError(400, "Bad request,read api first");
    if (!Array.isArray(cS))
        throw getError(400, "Request body invalid");
    let results = [];
    for (let cid of cS) {
        if (cid) {
            let foundRecord = yield TeaCourse.findOne({ where: { tId: tID, cId: +cid } });
            if (foundRecord)
                throw getError(400, "Record exists already");
            let result = yield TeaCourse.build({ tId: tID, cId: cid }).save();
            results.push(result);
        }
    }
    if (results.length === cS.length) {
        res.json({
            msg: "Record inserted successfully"
        });
    }
})));
router.get(/^\/tea\/([0-9]+)\/course$/, applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let tID = req.params[0];
    let teaCourseFounds = yield TeaCourse.findAll({ where: { tId: tID }, attributes: ['cId'] });
    let courseIds = [];
    let data = [];
    for (let tc of teaCourseFounds) {
        let cId = tc.cId;
        let course = yield Course.findOne({ where: { id: cId } });
        course = course.toJSON();
        let imagesFound = yield course_router_1.getImageNames({ fId: cId, forT: constants.ForT_Course });
        course.images = imagesFound;
        data.push(course);
    }
    res.json({
        count: data.length,
        data: data,
    });
})));
module.exports = router;
