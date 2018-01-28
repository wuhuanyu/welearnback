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
const models = require('../models/models');
const consts = require("../constants");
let course_count = 3;
let getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
let getRandomBoolean = () => {
    return Math.random() >= 0.5;
};
(() => __awaiter(this, void 0, void 0, function* () {
    console.log('into');
    for (let i = 0; i < course_count; i++) {
        let course_id = i + 1;
        for (let j = 0; j < 20; j++) {
            yield new models.Comment({
                forT: consts.ForT_Course,
                forId: course_id,
                aT: consts.ACC_T_Tea,
                aId: course_id,
                time: new Date().getTime(),
                body: '课程很不错'
            }).save();
            let saved_q = yield new models.Question({
                type: consts.QA,
                cId: course_id,
                tId: course_id,
                body: `问题${j}:你叫什么名字？多大了？光速是多少？傅里叶变换是多少？`,
                anss: [
                    { body: `回答${j}:我不会,问题很难`, images: ['art1,jpg', 'art2.jpg', 'math1.jpg'] },
                    { body: `回答${j}:我不会,问题很难`, images: ['art1,jpg', 'art2.jpg', 'math1.jpg'] },
                    { body: `回答${j}:我不会,问题很难`, images: ['art1,jpg', 'art2.jpg', 'math1.jpg'] }
                ],
                time: new Date().getTime(),
            }).save();
            for (let k = 0; k < 20; k++) {
                yield new models.Comment({
                    forT: consts.ForT_Question,
                    forId: saved_q._id,
                    aT: getRandomBoolean() ? consts.ACC_T_Stu : consts.ACC_T_Stu,
                    aId: getRandom(1, 4),
                    time: new Date().getTime(),
                    body: '是个好问题，能学到很多' + k,
                }).save();
            }
        }
    }
}))();
