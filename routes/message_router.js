
const router = require('express').Router();
const applyEMW = require('../utils/error').errMW;
const constants = require('../constants');
const models = require('../models/models');
const db = require('../mysqlcon');
const getError = require('../utils/error').getError;

router.post('', errMW(async (res, req, next) => {
    let auth = req.auth, msg_body = req.body.body, is_teacher = auth.type === constants.ACC_T_Tea;
    //TODO: add transaction support
    let course_id = req.url_params['course_id'];
    let transaction;
    try {
        transaction = await db.transaction();
        let saved_msg = await models.Message.build({
            is_teacher_send: is_teacher,
            teacher_id: (is_teacher ? auth.id : null),
            student_id: (is_teacher ? null : auth.id),
            send_time: new Date().getTime(),
            body: msg_body,
        }).save();
        let stu_recepient = (await models.StuCourse.findAll({ where: { cId: course_id }, attributes: ['sId'] }))
            .map(stu => ({
                message_id: saved_msg.id,
                recipient_course_id: course_id,
                recipient_stu_id: stu.id,
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
                recipient_teacher_id: teacher.id,
                is_read: false,
            })
            );
        
        let saved_tea_msg=await models.MessageRecipient.bulkCreate(tea_recipient);
        transaction.commit();
        //push service

        res.json({
            result:saved_msg.id,
            msg:'Message send successfully'
        });
    } catch (err) {
        await transaction.rollback();
        throw getError(500);
    }

}));
module.exports=router;