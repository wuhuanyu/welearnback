
const router = require('express').Router();
const teacher_auth = require('../auth/auth_middleware').teacher_auth;
const getError = require('../utils/error');
const applyEMW = require('../utils/error').errMW;
const Bulletin = require('../models/models').Bulletin;
const constants = require('../constants');
const mqtt_client = require('../globals').mqtt_client;

router.post('', teacher_auth, applyEMW(async (req, res, next) => {
	let auth = req.auth, { body } = req.body;
	let course_id = req.url_params['course_id'];
	if (!body) throw getError(400, 'Wrong format for Bulletin model,read api first');
	let new_bulletin = await Bulletin.build({
		course_id: course_id,
		publisher_id: auth.id,
		body: body,
		publish_time: new Date().getTime(),
	}).save();
	if (new_bulletin) {
		res.json({
			result: new_bulletin.id,
			msg: 'Bulletin published successfully!'
		});
		if(process.env.NODE_ENV!=='test'){
			mqtt_client.publish(`${course_id}`,JSON.stringify({
				type:constants.bulletin,
				payload:new_bulletin,
			}));
		}
	}
}));


router.get('', applyEMW(async (req, res, next) => {
	let course_id=req.url_params['course_id'];
	// let course_id = req.params[0];
	let bulletins = await Bulletin.findAll({ where: { course_id: course_id } });
	if (bulletins.length === 0) throw getError(400, 'No such resource');
	res.json({
		count: bulletins.length,
		data: bulletins
	});
}));


module.exports=router;