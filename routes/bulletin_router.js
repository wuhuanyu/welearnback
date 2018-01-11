
const router = require('express').Router();
const teacher_auth = require('../auth/auth_middleware').teacher_auth;
const getError = require('../utils/error');
const applyEMW = require('../utils/error').applyEMW;
const Bulletin = require('../models/models').Bulletin;


router.post('', teacher_auth, applyEMW(async (req, res, next) => {
    let auth = req.auth, { body } = req.body;
    let course_id = req.params[0];
    if (!body) throw getError(400, "Wrong format for Bulletin model,read api first");
    let new_bulletin = await Bulletin.build({
        course_id: course_id,
        publisher_id: auth.id,
        body: body,
        time: new Date().getTime(),
    }).save();

    res.json({
        result: new_bulletin.id,
        msg: "Bulletin published successfully!"
    });
}));


router.get('', applyEMW(async (req, res, next) => {
    let course_id=req.params[0];
    let bulletins=await Bulletin.findAll({where:{course_id:course_id}});
    if(bulletins.length===0) throw getError(400,"No such resource");
    res.json({
        count:bulletins.length,
        data:bulletins
    });
}));


module.exports=router;