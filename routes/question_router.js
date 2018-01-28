const router=require('express').Router();
const models=require('../models/models');
const TAG='[Question router]: ';
const teacher_auth=require('../auth/auth_middleware').teacher_auth;
const student_auth=require('../auth/auth_middleware').student_auth;
const common_auth=require('../auth/auth_middleware').common_auth;
const defaultConfig=require('../config/uploadconfig').defaultConfig;
const md5=require('md5');
const Constants=require('../constants');
const constants=Constants;
const isImage=require('../utils/check').isImage;
const getError=require('../utils/error');
const applyErrMiddleware=require('../utils/async_middleware');
const findByFieldFactory=require('../utils/commonquery');

/**
 * 
 * @param {Object} options 
 */
const getImageNames = async (options) => {
    let { forT, fId } = options;
    // console.log(fId);
    let images = await models._File.findAll({
        where: { forT: forT, fId: fId, fT: Constants.FT_IMAGE },
        attributes: ['name']
    });
    let imageNames = [];
    for (let im of images) {
        imageNames.push(im.name);
    }
    return imageNames;
};
/** 
 * authentication assumed 
 * req.auth.{id,name,password}
 * post question of a certain course
 * /23/question
 */
router.post('', teacher_auth, defaultConfig, applyErrMiddleware((req, res, next) => {
    let b = req.body, cid = req.url_params.course_id;
    let auth = req.auth;
    let files = (req.files&&req.files['upload'])||[];
    //check fields
    // let question_id=md5(new Date().getTime()+req.body.body);
    if (['type', 'body'].every(f => Object.keys(b).indexOf(f) > -1)) {
        let newQ = new models.Question({
            type: b.type,
            cId: cid,
            tId: req.auth.id,
            body: b.body,
            time: new Date().getTime(),
        });
        newQ.save().then(savedQ => {
            let savePromsies = files.map(file => {
                let { originalname, size, filename, path } = file;
                let newF = models._File.build({
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
                    msg: 'Question Upload Successfully'
                });
            });
        }).catch(e => {
            next(getError(500, e.message));
        });
    } else {
        next(getError(404, 'Wrong Question Format'));
    }
}));

/**
 * /12/question
 * get all questions of 12 course
 */
router.get('', applyErrMiddleware(async (req, res, next) => {
    let cId = req.url_params.course_id;
    let start=req.query.start||0;
    let limit=req.query.limit||3;
	
    let questions=await models.Question.find({cId:cId}).where('_id').gt(start-1).limit(limit).sort('-time');
    if (questions.length === 0) throw getError(404, 'No such resource');
    let quesitonsWithImage = [];
    let next_start=0;
    for (let [idx,q] of questions.entries()) {
        let images = await getImageNames({ fId: q._id, forT: Constants.ForT_Question });
        let obj = q.toObject();
        obj.images = images;
        quesitonsWithImage.push(obj);
        if(idx===0){
            next_start=q._id+1;
        }
    }
    res.json({
        count: questions.length,
        next:next_start,
        data: quesitonsWithImage

    });
}));


/**
 * post ans to 
 * /course/:courseId/:questionId/ans
 */
router.post(/^\/(\w+)\/ans$/, teacher_auth, defaultConfig, applyErrMiddleware(async (req, res, next) => {
    let auth = req.auth;
    let courseId = req.url_params.course_id , questionId = req.params[0];
    let files = (req.files&&req.files['upload'])||[];
    let imageNames = files.map(f => f.originalname).filter(fileName => isImage(fileName));
    let fileNames = files.map(f => f.originalname).filter(fileName => !isImage(fileName));
    let ans_id = md5(new Date().getTime()+req.body.body);
    let updated = await models.Question.update({ _id: questionId }, {
        $push: {
            anss: {
                _id: ans_id,
                body: req.body.body,
                files: fileNames,
                images: imageNames,
            }
        }
    });
    let savedFiles = [];
    for (let file of files) {
        let { originalname, size, filename, path } = file;
        let newF = models._File.build({
            aT: Constants.ACC_T_Tea,
            aId: auth.id,
            forT: Constants.ForT_Question,
            fId: ans_id,
            fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
            original_name: originalname,
            name: filename,
            dir: path,
        });
        let savedF = await newF.save();
        savedFiles.push(savedF.id);
    }
    res.json({
        result: updated,
        msg: 'Answer upload successfully',
    });
    // res.end();

}));


/**
 * 
 *  /12/12/comment
 * must specify user type 
 * tested
 */
router.post(/^\/(\w+)\/comment$/, defaultConfig, common_auth, applyErrMiddleware(async (req, res, next) => {
    // console.log('-------post comment to question--------');
    let c = req.url_params.course_id, q = req.params[0], author_type = req.auth.type;
    let body = req.body;
    let newC = new models.Comment({
        forT: constants.ForT_Question,
        forId: q,
        //must have type
        aT: author_type,
        aId: req.auth.id,
        body: body.body,
        time: new Date().getTime()
    });
    let savedC = await newC.save();

    /**
         * upload file processing
         */
    let files = (req.files&&req.files['upload'])||[];
    let savedFiles = [];
    if ( files.length !== 0) {
        //there is file
        for (let file of files) {
            let { originalname, size, filename, path } = file;
            let newF = models._File.build({
                aT: author_type,
                aId: req.auth.id,
                forT: constants.ForT_Comment,
                fId: savedC._id,
                fT: (isImage(originalname) ? constants.FT_IMAGE : constants.FT_FILE),
                original_name: originalname,
                name: filename,
                dir: path
            });
            savedFiles.push(await newF.save());
        }
    }
    //if there is file,
    if (files.length !== 0) {
        if (files.length === savedFiles.length) {
            res.status(200).json({
                msg: 'Comment Successfully!',
                result: savedC.id,
            });
        }
        else throw getError(500, 'Something happens when storing file');
    }
    else
        res.status(200).json({
            msg: 'Comment Successfully!',
            result: savedC._id,
        });

}
// }
)
);

/**
 * /course/1/question/1/comment
 * get all comments of a question of a course
 * tested
 */
router.get(/\/(\w+)\/comment$/, applyErrMiddleware(async (req, res, next) => {
	
    let c = req.url_params.course_id, q = req.params[0];
    console.log(TAG,'-----------question router--------------');
    let start=+req.query.start||0,limit=+req.query.limit||5;

    // let comments = await findByFieldFactory('comment', ['forT', 'forId'], { time: 1 })([constants.ForT_Question, q]);
    let comments= await models.Comment.find({forT:constants.ForT_Question,forId:q}).where('_id').gt(start-1).limit(limit).sort('-time');
    if (comments.length === 0) throw getError(400, 'No such resource');
    let next_start=0;
    let datas = [];
    for (let [idx,comment] of comments.entries()) {
        let aT = comment.aT;
        let aId = comment.aId;
        let user = (aT === constants.ACC_T_Tea ? models.Teacher : models.Stu);
        let userFound = await user.findById(aId);
        let data = comment.toObject();
        // data._id=comment._id;
        // console.log(data);
        let images = await getImageNames({ forT: constants.ForT_Comment, fId: comment._id });
        data.author = userFound.name;
        data.images = images;
        datas.push(data);
        if(idx===0){
            next_start=comment._id+1;
        }
    }
    res.json({
        count: datas.length,
        data: datas,
        next:next_start,
    });
}));



module.exports=router;