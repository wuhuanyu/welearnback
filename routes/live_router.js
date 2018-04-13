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
const mqtt = require('../globals').mqtt_client;
const Constants = require("../constants");
LiveRouter.post('', ErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    let found = yield Live.findOne({
        where: {
            course_id: course_id,
            finish: false,
        }
    });
    if (found) {
        throw getError(401, "Already has a live reserved");
    }
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
    let courseName = (yield Models.Course.findOne({
        where: {
            id: course_id
        },
        attributes: ['name'],
    })).name;
    savedLive = savedLive.toJSON();
    savedLive.course_name = courseName;
    mqtt.publish(`${course_id}`, JSON.parse({
        type: Constants.NEW_LIVE_RESERVED,
        payload: savedLive,
    }));
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
LiveRouter.patch(/\/([0-9]+)$/, ErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    let live_id = +(req.params[0]);
    let live = yield Live.findOne({
        where: {
            id: live_id,
            course_id: course_id
        }
    });
    if (!live)
        throw getError(404);
    let updatedLive = yield live.update(req.body);
    if (updatedLive.is_going) {
        mqtt.publish(`${course_id}`, JSON.stringify({
            type: Constants.NEW_LIVE_STARTED,
            payload: updatedLive,
        }));
    }
    res.json({
        result: live.id
    }).end();
})));
LiveRouter.delete(/\/([0-9]+)$/, ErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    let live_id = +(req.params[0]);
    let found = yield Live.findOne({
        where: {
            id: live_id,
            course_id: course_id,
        }
    });
    if (!found)
        throw getError(404);
    else {
        yield found.destory();
        res.end();
    }
})));
exports.default = LiveRouter;
