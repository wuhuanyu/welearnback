const express = require('express');
const router = express.Router();
const TAG = "[QuestionRouter]: ";
import check from '../utils/check';
const Question = require('../models/question');
const findByFieldsFactory=require('../utils/commonquery');
const getErr = require('../utils/error');

/**
 * post /question
 * must be teacher
 * authentication assumed in app.locals.{id,password,}
 */
/**
 * Tested
 */
router.post('', (req, res, next) => {
    /**
     * check fields ok
     */
    if (check(req.body, Question.checkedFields)) {
        let newQ = new Question({
            type: req.body.type,
            cId: req.body.cId,
            tId: req.body.tId,
            body: req.body.body,
            ans: req.body.ans,
            time: new Date().getTime(),
        });
        newQ.save().then(
            (savedQ) => {
                console.log(TAG + "savedOK " + JSON.stringify(savedQ))
                res.status(200).json({ msg: "Question posted successfully" });
            })
    }
    else {
        next(getErr(400, "Question Wrong Format"));
    }
});

/**
 * Tested
 */
router.get('',(req,res,next)=>{
    let fields=Object.keys(req.query);
    /**
     * check if fields  are valid
     */
    if(fields.every(f=>Question.checkedFields.indexOf(f)>-1)){
        let fieldVs=[];
        fields.forEach(f=>fieldVs.push(req.query[f]));
        findByFieldsFactory('question',fields)(fieldVs).then(d=>{
            res.status(200).json({
                count:d.length,
                data:d
            });
        });
    }else{
        let err=new Error();
        err.code=404;
        err.msg="No such fields";
        next(err);
    }
})


 module.exports=router;