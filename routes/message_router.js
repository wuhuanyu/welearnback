import course_router from './course_router';

const router=require('express').Router();
const applyErrMiddleware=require('../utils/error').errMW;
const applyErrMW=applyErrMiddleware;
const Message=require('../models/message');
const MessageFields=['receiverId','body'];
const getError=require('../utils/error');
const TeaCourse=require('../models/models').TeaCourse;
const common_auth=require('../auth/auth_middleware').common_auth;

/**
 * must auth;
 */
router.use(common_auth);

// router.post('',applyErrMW(checkAuth),applyErrMW(async (req,res,next)=>{
//     let senderId=req.auth.id, auth=req.auth;
//     // authentication assumed
//     let {receiverId,body} =req.body;
//     if(!receiverId||!body) throw getError(400,"Wrong message format");
//     let saved=await Message.build({
//         sender_id:auth.id,
//         recipient_course_id:receiverId,
//         body:body,
//     }).save();
//     res.json({
//         result:saved.id,
//         msg:"Message sent successfully"
//     });
// }));

// /**
//  * get  /message/:courseId
//  * authentication assumed
//  */
// router.get(/^\/message\/([0-9]+)$/,applyErrMW(async (req,res,next)=>{
//     let courseId=req.params[0];
//     let msgs=await Message.findAll({where:{recipient_course_id:courseId}});
//     if(msgs.length===0)throw getError(404,"No such resource");
//     res.json({
//         count:msgs.length,
//         data:msgs
//     });
// }));


module.exports=router;