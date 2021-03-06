
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
    let authorization: string = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }

    else {
        //have not refresh token
        if (!(req.auth)) {
            let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
            let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
            let found = await redis.hgetallAsync(`${type}:user:${id}`);
            if (!found) throw getErr(403, 'Access Denied');
            else {
                req.auth={};
                if (found.token !== token) throw getErr(403, 'Access Denied');
                else {
                    req.auth.id = id;
                    req.auth.name = found.username;
                    req.auth.password = found.password;
                    req.auth.type = type;
                    req.auth.avatar = found.avatar;
                    next();
                }
            }
        }
        else{
            next();
        }

    }

});

/**
 * 之所以分开写，是考虑到将来 老师的验证可能需要更复杂的逻辑
 */
module.exports.student_auth = applyEMW(async (req, res, next) => {
   let authorization: string = req.get('authorization');
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');
    }

    else {
        //have not refresh token
        if (!(req.auth)) {
            let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
            let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
            let found = await redis.hgetallAsync(`${type}:user:${id}`);
            if (!found) throw getErr(403, 'Access Denied');
            else {
                req.auth={};
                if (found.token !== token) throw getErr(403, 'Access Denied');
                else {
                    req.auth.id = id;
                    req.auth.name = found.username;
                    req.auth.password = found.password;
                    req.auth.type = type;
                    req.auth.avatar = found.avatar;
                    next();
                }
            }
        }
        else{
            next();
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
    let authorization: string = req.get('authorization');//获取authorizaiton字段
    if (!authorization) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        throw getErr(401, 'Authorization Required');//如果包含authroization字段，返回错误
    }
    else {
        //have not refresh token
        if (!(req.auth)) {
            //base64解码，并获取usertype，id，token
            let credentials = new Buffer(authorization.split(' ').pop(), 'base64').toString('ascii').split(':');
            let type = +(credentials[0]), id = +(credentials[1]), token = credentials[2];
            //查询缓存，如果缓存条目不存在，返回存在
            let found = await redis.hgetallAsync(`${type}:user:${id}`);
            if (!found) throw getErr(403, 'Access Denied')
            else {
                req.auth={};
                if (found.token !== token) throw getErr(403, 'Access Denied');
                else {
                    //取出相应信息，传入下一个中间件
                    await redis.expireAsync(`${type}:user:${id}`,30*60);
                    req.auth.id = id;
                    req.auth.name = found.username;
                    req.auth.password = found.password;
                    req.auth.type = type;
                    req.auth.avatar = found.avatar;
                    next();
                }
            }
        }
        else{
            next();
        }
    }

});