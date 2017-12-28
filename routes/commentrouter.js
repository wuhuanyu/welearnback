const router = require('express').Router();
const TAG = "[CommentRouter]: ";
import check from '../utils/check';
const Comment = require('../models/comment');
const findByFieldsFactory = require('../utils/commonquery');
const getErr = require('../utils/error');
const _ = require('lodash');

router.post('', (req, res, next) => {
    let keys = Object.keys(req.body);
    if (_.isEqual(keys, Comment.checkedFields)) {
        let body = req.body;
        let newC = new Comment({
            qId: body.qId,
            aT: body.aT,
            aId: body.aId,
            body: body.body,
            time: new Date().getTime()
        });
        newC.save().then((savedC) => {
            res.status(200).json({
                msg: "Comment Successfully!",
                result: savedC.id,
            })
        }).catch(e => {
            next(getErr(500, e.message));
        })
    } else {
        next(getErr(400, "Wrong Comment Format"));
    }
});

router.get('', (req, res, next) => {
    let fields = Object.keys(req.query);
    /**
     * check fields
     */
    let fieldVs = [];
    if (fields.every(f => {
        fieldVs.push(req.query[f]);
        return Comment.checkedFields.indexOf(f) > -1
    }
    )) {
        //ascend order
        findByFieldsFactory('comment', fields, { time: 1 })(fieldVs)
        .then((ds)=>{
            res.status(200).json({
                count:ds.length,
                data:ds,
            });
        }).catch(e=>{
            next(getErr(500,e.message));
        })
    } else {
        next(getErr(404, "No such field"));
    }
})
module.exports=router;