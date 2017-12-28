const express=require('express');
const route=express.Router();
const TAG="[QuestionRouter]: ";
import check from '../utils/check';
import { checkServerIdentity } from 'tls';
const Question = require('../models/question');
const getErr=require('../utils/error');

/**
 * post /question
 * must be teacher
 * authenticattion assumed in app.locals.{id,password,}
 */

 
 route.post(/^\$/,(req,res,next)=>{
     console.log(TAG);
     console.log(req.app.locals.id);
     console.log(JSON.stringify(req.body));
     /**
      * check fields ok
      */
     if(check(req.body,Question.checkedFields)){
         let {type,cId,tId,body,answer}=req.body;
         let newQ=new Question({
             type:req.body.type,
             cId:req.body.cId,
             tId:req.body.tId,
             body:req.body.body,
             ans:req.body.ans,
             time:new Date().getDate()
         });
         newQ.save((savedQ)=>{
             console.log(TAG+"savedOK"+JSON.stringify(savedQ))
             res.status(200).json({msg:"Question posted successfully"});
         })
     } 
     else{
         next(getErr(404,"Question Wrong Format"));
     }
 });

 route.get(/^/)