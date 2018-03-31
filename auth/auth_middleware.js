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
const _redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(_redis.RedisClient.prototype);
bluebird.promisifyAll(_redis.Multi.prototype);
const redis = _redis.createClient();
module.exports.teacher_auth = applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.auth = {};
    let authorization = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
        let found = yield redis.hgetAsync(`${type}:user:${id}`);
        if (!found)
            throw getErr(403, 'Access Denied');
        else {
            if (found.token !== token)
                throw getErr(403, 'Access Denied');
            else {
                req.auth.id = id;
                req.auth.name = found.name;
                req.auth.password = found.password;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
                next();
            }
        }
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
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
        let found = yield redis.hgetAsync(`${type}:user:${id}`);
        if (!found)
            throw getErr(403, 'Access Denied');
        else {
            if (found.token !== token)
                throw getErr(403, 'Access Denied');
            else {
                req.auth.id = id;
                req.auth.name = found.name;
                req.auth.password = found.password;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
                next();
            }
        }
    }
}));
module.exports.common_auth = applyEMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.auth = {};
    console.log('common auth');
    let authorization = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
        let found = yield redis.hgetallAsync(`${type}:user:${id}`);
        if (!found)
            throw getErr(403, 'Access Denied');
        else {
            if (found.token !== token)
                throw getErr(403, 'Access Denied');
            else {
                console.log(found);
                console.log('common auth found ');
                req.auth.id = id;
                req.auth.name = found.username;
                req.auth.password = found.password;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
                next();
            }
        }
    }
}));
