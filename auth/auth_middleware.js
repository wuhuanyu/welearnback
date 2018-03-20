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
const applyEMW = require('../utils/async_middleware');
const getErr = require('../utils/error');
const Teacher = require('../models/models').Teacher;
const Student = require('../models/models').Stu;
const md5 = require('md5');
const constants = require('../constants');
const globals_1 = require("../globals");
const checkAuth = (isTeacher, name, pass) => __awaiter(this, void 0, void 0, function* () {
    let user = isTeacher ? Teacher : Student;
    let found = yield user.findOne({ where: { name: name, password: md5(pass) } });
    return found;
});
module.exports.teacher_auth = applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.auth = {};
    let authorization = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let found = yield globals_1.redis.hgetAsync(`user:${credentials[0]}`);
        if (found) {
            req.auth.id = found.id;
            req.auth.name = found.name;
            req.auth.password = found.password;
            req.avatar = found.avatar;
            req.type = constants.ACC_T_Tea;
            next();
        }
        else
            throw getErr(403, 'Access Denied (incorrect credentials)');
    }
}));
module.exports.student_auth = applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.auth = {};
    let authorization = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let found = yield globals_1.redis.hgetAsync(`user:${credentials[0]}`);
        if (found) {
            req.auth.id = found.id;
            req.auth.name = found.name;
            req.auth.password = found.password;
            req.auth.avatar = found.avatar;
            req.auth.type = constants.ACC_T_Stu;
            next();
        }
        else
            throw getErr(403, 'Access Denied (incorrect credentials)');
    }
}));
module.exports.common_auth = applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.auth = {};
    let authorization = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let found = yield globals_1.redis.hgetAsync(`user:${credentials[0]}:${credentials[1]}`);
        if (found) {
            req.auth.id = credentials[0],
                req.auth.name = found.name;
            req.auth.password = found.password;
            req.auth.type = +(found.type);
            req.auth.avatar = found.avatar;
            next();
        }
        else
            throw getErr(403, 'Access Denied (incorrect credentials)');
    }
}));
