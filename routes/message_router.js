const router = require('express').Router();
const applyEMW = require('../utils/error').errMW;
const constants = require('../constants');
const models = require('../models/models');
const db = require('../mysqlcon');
const getError = require('../utils/error');
const OP=require('../mysqlcon').Op;
const mqtt_client=require('../globals').mqtt_client;

router.post('', applyEMW(async (req, res, next) => {

	let auth = req.auth, msg_body = req.body.body, is_teacher = auth.type === constants.ACC_T_Tea;
	if(!msg_body) throw getError(400,'Wrong format message body,Read Api first');
	let course_id = req.url_params['course_id'];
	let transaction;
	try {
		transaction = await db.transaction();
		let saved_msg = await models.Message.build({
			is_teacher_send: is_teacher,
			teacher_id: (is_teacher ? auth.id : null),
			student_id: (is_teacher ? null : auth.id),
			send_time: new Date().getTime(),
			course_id:course_id,
			body: msg_body,
		}).save();
		let stu_recepient = (await models.StuCourse.findAll({ where: { cId: course_id }, attributes: ['sId'] }))
			.map(stu => ({
				message_id: saved_msg.id,
				recipient_course_id: course_id,
				recipient_stu_id: stu.sId,
				recipient_teacher_id: null,
				is_read: false,
			}));

		let saved_stu_msg = await models.MessageRecipient.bulkCreate(stu_recepient);

		let tea_recipient = (await models.TeaCourse.findAll({ where: { cId: course_id }, attributes: ['tId'] }))
			.map(
				teacher => ({
					message_id: saved_msg.id,
					recipient_course_id: course_id,
					recipient_stu_id: null,
					recipient_teacher_id: teacher.tId,
					is_read: false,
				})
			);

		let saved_tea_msg = await models.MessageRecipient.bulkCreate(tea_recipient);
		transaction.commit();
		//push service
		saved_msg=saved_msg.toJSON();
		saved_msg.sender_name=auth.name;
		mqtt_client.publish(`${course_id}`,JSON.stringify({
			type:constants.new_message,
			payload:saved_msg,	
		}));
		res.json({
			result: saved_msg.id,
			msg: 'Message send successfully'
		});
	} catch (err) {
		await transaction.rollback();
		throw getError(500,err.message);
	}
}));

router.get('',applyEMW(async (req,res,next)=>{
	let time_before=req.url_queries['before']||new Date().getTime()
		,time_after=req.url_params['after']||0
		,count=req.url_params['count']||Number.MAX_SAFE_INTEGER;
	let msgs=await models.Message.findAll({
		where:{
			send_time:{
				[OP.between]:[time_after,time_before],
			}
		},limit:count,
	});
	if(!msgs.length===0) throw getError(404,'No such resource');
	res.json({
		count:msgs.length,
		data:msgs,
	});
}));

router.patch('',applyEMW(async (req,res,next)=>{
	let msg_id=+req.url_queries['msg_id'],is_teacher=req.auth.type===constants.ACC_T_Tea;
	if(!msg_id) throw getError(404,'Wrong request format,read api first');
	let msg_recipient=await models.MessageRecipient.findOne({
		where:{
			message_id:msg_id,
			recipient_stu_id:(is_teacher?null:req.auth.id),
			recipient_teacher_id:(is_teacher?req.auth.id:null),
		}
	});
	msg_recipient.is_read=true;
	let updated=await msg_recipient.save();
	res.json({
		result:updated.id,
		msg:'Message Recipient updated'
	});
}));
module.exports=router;