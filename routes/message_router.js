const router = require('express').Router();
const applyEMW = require('../utils/error').errMW;
const constants = require('../constants');
const models = require('../models/models');
const db = require('../mysqlcon');
const getError = require('../utils/error').getError;

router.post('', errMW(async (res, req, next) => {
    let auth = req.auth, msg_body = req.body.body, is_teacher = auth.type === constants.ACC_T_Tea;
    //TODO: add transaction support
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
        
    } catch (err) {
        await transaction.rollback();
        throw getError(500);
    }

}));
module.exports=router;