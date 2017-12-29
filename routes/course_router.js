const router = require('express').Router();
import Course from '../models/course';
const getError = require('../utils/error');
const findByFieldFactory = require('../utils/commonquery');
const Question = require('../models/question');
const Comment = require('../models/comment');
const TAG = "[CourseRouter]: ";
import * as constants from '../constants';
/**
 * tested
 */
router.post('', (req, res, next) => {
    let b = req.body;
    if (['name', 'desc'].every(f => {
        return Object.keys(b).indexOf(f) > -1;
    })) {
        let n = b.name, d = b.desc;
        let newC = Course.build({
            name: n,
            desc: d,
        });
        newC.save().then(savedC => {
            res.status(200).json({
                result: savedC.id,
                msg: "Course Uploaded Successfully"
            });
        });
    } else {
        next(getError(400, "Course Wrong Format"));
    }
});

/**
 * /api/v1/course/:id
 * tested
 */
router.get(/^\/([0-9]+)$/, (req, res, next) => {
    let id = req.params[0];
    // console.log(TAG + req.params[0]);
    if (!isNaN(id)) {
        Course.findById(+id).then(foundC => {
            if (foundC) {
                res.status(200).json({
                    count: 1,
                    data: foundC,
                })
            } else {
                next(getError(404, "Resource Not Found"));
            }
        });
    };
});
/**
 * tested
 * http://localhost:3000/api/v1/course?name=Art
 */
router.get('', (req, res, next) => {
    let n = req.query.name;
    console.log(TAG + n);
    Course.findOne({ where: { name: n } }).then(foundC => {
        if (foundC) {
            res.status(200).json({
                count: 1,
                data: foundC
            });
        }
        else {
            next(getError(404, "Resource Not Found"));
        }
    });
});


/** 
 * authentication assumed 
 * req.auth.{tId,name,password}
 * post question of a certain question
 * /23/question
 * 
 */

router.post(/^\/([0-9]+)\/question$/, (req, res, next) => {
    console.log(TAG);

    let b = req.body, cid = req.params[0];
    //check fields
    if (['type', 'body', 'ans'].every(f => Object.keys(b).indexOf(f) > -1)) {
        let newQ = new Question({
            type: b.type,
            cId: cid,
            tId: req.auth.id,
            body: b.body,
            ans: b.ans,
            time: new Date().getTime(),
        });
        newQ.save().then(savedQ => {
            res.status(200).json({
                result: savedQ._id,
                msg: "Question Upload Successfully"
            })
        }).catch(e => {
            next(getError(500, ""))
        });
    } else {
        next(getError(404, "Wrong Question Format"));
    }
});

/**
 * /12/questions
 * get all questions of 12 course
 */
router.get(/^\/([0-9]+)\/questions$/, (req, res, next) => {
    let cId = req.params[0];
    findByFieldFactory('question', ['cId'], { time: -1 })([cId]).then(datas => {
        res.status(200).json({
            count: datas.length,
            data: datas,
        });
    })
});


/**
 *  /12/12/comment
 * tested
 */
router.post(/^\/([0-9]+)\/([0-9]+)\/comment$/, (req, res, next) => {
    let c = req.params[0], q = req.params[1];

    if ('body' in req.body) {
        let body = req.body;
        let newC = new Comment({
            qId: q,
            aT: req.auth.type,
            aId: req.auth.id,
            body: body.body,
            time: new Date().getTime()
        });
        newC.save().then((savedC) => {
            res.status(200).json({
                msg: "Comment Successfully!",
                result: savedC.id,
            })
        }).catch(e => {
            next(getError(500, e.message));
        })
    } else {
        next(getError(400, "Wrong Comment Format"));
    }
});

/**
 * /course/question/comments
 * /12/24/comments
 * get all comments of a question of a course
 */
router.get(/^\/([0-9]+)\/([0-9]+)\/comments$/, (req, res, next) => {
    let c = req.params[0], q = req.params[1];
    findByFieldFactory('comment', ['qId'], { time: 1 })([q]).then(datas => {
        if (!datas.length) {
            next(getError(404, "No such Resource"));
        }
        else if(datas.length) {
            res.status(200).json({
                count: datas.length,
                data: datas,
            })

        }

    });
});
export default router;