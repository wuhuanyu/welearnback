const router = require('express').Router();
import { Question, Comment, Course } from '../models/models';
const getError = require('../utils/error');
const findByFieldFactory = require('../utils/commonquery');
const TAG = "[CourseRouter]: ";
import * as constants from '../constants';
const _File = require('../models/models').UploadFile;
const multer = require('multer');
const _path = require('path');
const commonFileDest = _path.resolve(__dirname, '../uploads');
const imageDest = _path.resolve(__dirname, '../uploads/images');
import * as Constants from '../constants'; ``
import { isImage } from '../utils/check';
//storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(JSON.stringify(file));
        if (isImage(file.originalname)) {
            cb(null, imageDest);
        }
        else {
            cb(null, commonFileDest);
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    }
});
const upload = multer({ storage: storage });
const multipleUp = upload.fields([{ name: "upload", maxCount: 5 }]);

/**
 * tested
 * 
 */
router.post('', multipleUp, (req, res, next) => {
    let b = req.body;
    // console.log(JSON.stringify(b));
    let files = req.files['upload'], auth = req.auth;
    if (['name', 'desc'].every(f => {
        return Object.keys(b).indexOf(f) > -1;
    })) {
        let n = b.name, d = b.desc;
        let newC = Course.build({
            name: n,
            desc: d,
        });
        newC.save().then(savedC => {
            let savePromsies = files.map(file => {
                let { originalname, size, filename, path } = file;
                let newF = _File.build({
                    aT: Constants.ACC_T_Tea,
                    aId: auth.id,
                    forT: Constants.ForT_Course,
                    fId: savedC.id,
                    fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
                    original_name: originalname,
                    name: filename,
                    dir: path,
                });
                return newF.save();
            });
            Promise.all(savePromsies).then(saved => {
                res.status(200).json({
                    result: savedC.id,
                    msg: "Course Uploaded Successfully"
                });
            });
        });
    } else {
        next(getError(400, "Course Wrong Format"));
    }
});

/**
 * /api/v1/course/:id
 * TODO:test get image
 */
router.get(/^\/([0-9]+)$/, (req, res, next) => {
    let id = req.params[0];
    // console.log(TAG + req.params[0]);
    if (!isNaN(id)) {
        Course.findById(+id).then(foundC => {
            if (foundC) {
                _File.findAll({ where: { forT: constants.ForT_Course, fId: foundC.id, fT: constants.FT_IMAGE }, attributes: ['name'] })
                    .then(images => {
                        foundC.images = images;
                        res.status(200).json({
                            count: 1,
                            data: foundC,
                        })
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
 * TODO:add image 
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
 * TODO: test file upload,image upload 
 */
router.post(/^\/([0-9]+)\/question$/, multipleUp, (req, res, next) => {
    console.log(TAG);
    let b = req.body, cid = req.params[0];
    let auth=req.auth;
    let files = req.files['upload'];
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
            let savePromsies = files.map(file => {
                let { originalname, size, filename, path } = file;
                let newF = _File.build({
                    aT: Constants.ACC_T_Tea,
                    aId: auth.id,
                    forT: Constants.ForT_Question,
                    fId: savedQ._id,
                    fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
                    original_name: originalname,
                    name: filename,
                    dir: path,
                });
                return newF.save();
            });
            Promise.all(savePromsies).then(saved => {
                res.status(200).json({
                    result: savedQ._id,
                    msg: "Question Upload Successfully"
                })
            });
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
 * 
 *  /12/12/comment
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
        else if (datas.length) {
            res.status(200).json({
                count: datas.length,
                data: datas,
            })
        }
    });
});
export default router;