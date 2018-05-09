
const _msg_queue = require('../../globals').msg_queue;
const mqtt_broker = require('../../globals').mqtt_client;
const queue = 'msg';
const models = require('../../models/models');
const db = require('../../mysqlcon');
const constants = require('../../constants');
process.on('exit', function (code) {
    console.log(`worker process exits with code ${code}`);
});


/**
 * 
 * @param {*} queue 
 * @param {*} msg 
 * input 
 * msg:{
 *   type:12,
 *   body:"this is message",
 *   sender_id:"12",
 *   sender_name:"stack",
 *   avatar:"avatar",
 *   course_id:34343,
 * }
 * 
 * output
 * new msg:
 * {
 *  id:13,
    "type":1,
    "sender_id":23,
    "sender_name":"tom",
    "avatar":"avatar.jpg",
    "course_id":1,
    "course_name":"English",
    
    "body":"this is a messaage",
    "timestamp":457985749354
}
 */

async function persist(msg) {
    console.log('----------starting persist-------------');
    console.log(msg);
    let { type, course_id, body, sender_id, avatar, sender_name } = msg;
    if(!(type&&course_id&&body&&sender_id&&sender_name))return null;

    let is_teacher = (type === constants.ACC_T_Tea);
    let transaction;
    try {
        transaction = await db.transaction();
        let saved_msg = await models.Message.build({
            is_teacher_send: is_teacher,
            teacher_id: (is_teacher ? sender_id : null),
            student_id: (is_teacher ? null : sender_id),
            send_time: new Date().getTime(),
            course_id: course_id,
            body: body,
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
        let course_name = (await models.Course.findOne({ where: { id: course_id } })).name;

        let msg = {};

        msg.id=saved_msg.id;
        msg.type = type;
        msg.sender_id = sender_id;
        msg.sender_name = sender_name;
        msg.avatar = avatar;
        msg.course_id = course_id;
        msg.course_name = course_name;
        msg.body = body;
        msg.send_time = saved_msg.send_time;

        return msg;

    } catch (err) {
        await transaction.rollback();
    }
}


async function push(msg) {
    //在course_id这个主题下发布信息
    await mqtt_broker.publish(`${msg.course_id}`, JSON.stringify({
        //表示该内容为即时通讯
        type: constants.new_message,
        //信息主体
        payload: msg,
    }));
}


async function process_msg() {
    let msg_queue = await _msg_queue;
    await msg_queue.consume(queue, async (_) => {
        let new_msg=await persist(JSON.parse(_.content.toString()));
        await push(new_msg);
        msg_queue.ack(_);
    });
}

process_msg();