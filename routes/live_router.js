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
const Express = require("express");
const Live = require('../models/models').Live;
const ErrorMW = require('../utils/error').errMW;
const LiveRouter = Express.Router();
const TAG = 'LiveRouter';
const redis = require('../globals').redis;
const md5 = require('md5');
const livekey = "private";
const Models = require('../models/models');
const getError = require('../utils/error');
LiveRouter.post('', ErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    let { title, time } = req.body;
    let auth = req.auth;
    let expire = ((+time) + 10 * 60 * 1000) / 1000 | 0;
    let hash = md5(`/live/course${course_id}-${expire}-${livekey}`);
    let url = `/live/course${course_id}?sign=${expire}-${hash}`;
    let savedLive = yield Live.build({
        course_id: course_id,
        teacher_id: auth.id,
        title: title,
        time: time,
        url: url,
    }).save();
    res.json({
        result: savedLive.id,
    }).end();
})));
LiveRouter.get('', ErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    let lives = yield Live.findAll({
        where: {
            course_id: course_id
        }
    });
    if (lives.length === 0)
        throw getError(404, 'No such resource');
    res.json({
        count: lives.length,
        data: lives,
    }).end();
})));
exports.default = LiveRouter;
