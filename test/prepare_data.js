import { model } from 'mongoose';


const models = require('../models/models');
const chai = require('chai');

const mongoose = require('mongoose');


let should = chai.should();
const consts = require('../constants');
let course_count = 3;

let getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

let getRandomBoolean = () => {
    return Math.random() >= 0.5;
};
describe('Prepare data', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/welearn');
        await models.Comment.remove({});
        await models.Question.remove({});
        await models.Bulletin.drop();
        await models.Bulletin.sync();
        for (let i = 0; i < course_count; i++) {
            let course_id = i + 1;
            //课程通知
            for (let m = 0; m < 5; m++) {
                await models.Bulletin.build({
                    body: `课程${course_id}:的通知，明天考试`,
                    course_id: course_id,
                    publisher_id: course_id,
                    publish_time: new Date().getTime()-m*24*60*60*1000,
                }).save()
            }

            for (let j = 0; j < 10; j++) {
                //comments
                await new models.Comment({
                    forT: consts.ForT_Course,
                    forId: course_id,
                    aT: consts.ACC_T_Tea,
                    aId: course_id,
                    time: new Date().getTime()-j*24*60*60*1000,

                    body: `课程${course_id}很不错`,
                }).save();
                //questions
                let saved_q = await new models.Question({
                    type: consts.QA,
                    cId: course_id,
                    tId: course_id,
                    body: `课程${course_id}的问题${j}:你叫什么名字？多大了？光速是多少？傅里叶变换是多少？`,
                    anss: [
                        { body: `回答${j}:我不会,问题很难`, images: ['art1,jpg', 'art2.jpg', 'math1.jpg'] },
                        { body: `回答${j}:我不会,问题很难`, images: ['art1,jpg', 'art2.jpg', 'math1.jpg'] },
                        { body: `回答${j}:我不会,问题很难`, images: ['art1,jpg', 'art2.jpg', 'math1.jpg'] }
                    ],
                    time: new Date().getTime()-j*24*60*60*1000,
                }).save();
                //习题评论
                for (let k = 0; k < 20; k++) {
                    await new models.Comment({
                        forT: consts.ForT_Question,
                        forId: saved_q._id,
                        aT: getRandomBoolean() ? consts.ACC_T_Stu : consts.ACC_T_Stu,
                        aId: getRandom(1, 4),
                        time: new Date().getTime()-k*24*60*60*1000,
                        body: '是个好问题，能学到很多' + k,
                    }).save();
                }
            }
        }
    });

    describe('prepare data', () => {
        it('it should prepare data', (done) => {
            done();
        });
    });
});