
const applyEMW = require('../utils/async_middleware');
const getErr = require('../utils/error');
const Teacher = require('../models/models').Teacher;
const Student = require('../models/models').Stu;
const md5 = require('md5');
const constants = require('../constants');
import * as express from 'express';

import * as _redis from 'redis';
import * as bluebird from 'bluebird';
bluebird.promisifyAll(_redis.RedisClient.prototype);
bluebird.promisifyAll(_redis.Multi.prototype);
const redis = _redis.createClient();
/**
 * basic auth 
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 */


module.exports.teacher_auth = applyEMW(async (req, res, next) => {
    req.auth = {};

    let authorization: string = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {

        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
        let found = await redis.hgetAsync(`${type}:user:${id}`);

        if (!found) throw getErr(403, 'Access Denied');
        else {
            if (found.token !== token) throw getErr(403, 'Access Denied');
            else {
                req.auth.id = id;
                req.auth.name = found.name;
                req.auth.password = found.password;
                // req.auth.gender=found.gender;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
                next();

            }
        }
    }
});

/**
 * 之所以分开写，是考虑到将来 老师的验证可能需要更复杂的逻辑
 */
module.exports.student_auth = applyEMW(async (req, res, next) => {
    req.auth = {};

    let authorization: string = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {

        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
        let found = await redis.hgetAsync(`${type}:user:${id}`);

        if (!found) throw getErr(403, 'Access Denied');
        else {
            if (found.token !== token) throw getErr(403, 'Access Denied');
            else {
                req.auth.id = id;
                req.auth.name = found.name;
                req.auth.password = found.password;
                // req.auth.gender=found.gender;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
                next();

            }
        }
    }

});


/**
 * 
 * @param {*} req  requst must have type field
 * @param {*} res 
 * @param {*} next 
 * 客户端发送type:id:token,服务器端校验token,
 */

module.exports.common_auth = applyEMW(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.auth = {};
    console.log('common auth');

    let authorization: string = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }
    else {
      
        let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
        let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
        let found = await redis.hgetallAsync(`${type}:user:${id}`);

        if (!found) throw getErr(403, 'Access Denied');
        else {
            if (found.token !== token) throw getErr(403, 'Access Denied');
            else {
                console.log(found);
                console.log('common auth found ');
                req.auth.id = id;
                req.auth.name = found.username;
                req.auth.password = found.password;
                // req.auth.gender=found.gender;
                req.auth.type = type;
                req.auth.avatar = found.avatar;
                next();

            }
        }
    }

});