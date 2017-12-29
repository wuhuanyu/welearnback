const router = require('express').Router();
import Stu from '../models/stu';
const getError = require('../utils/error');
const md5 = require('md5');
/**
 * student signup
 */

router.post('/stu', (req, res, next) => {
    let uBody = req.body;
    let keys = Object.keys(uBody);
    //check fields must have name,password,gender
    if (Stu.checkedFields.every(f => keys.indexOf(f) > -1)) {
        let n = uBody.name, p = uBody.password, g = uBody.gender;//assume gender is a number,uncheck
        Stu.findOne({ where: { name: n } }).then(stuFind => {
            if (stuFind) {
                next(getError(400, "Name exsits already"));
            } else {
                let newStu = Stu.build({
                    name: n,
                    password: md5(p),
                    gender: +g,
                });
                newStu.save().then(savedStu => {
                    res.status(200).json({
                        id:savedStu.id,
                        msg: "SignUp Succesfully",
                    });
                }).catch(e => next(getError(500, e.message)));
            }
        }).catch(e => {
            next(getError(500, e.message));
        })
    } else {
        next(getError(400, "Wrong format for Stu signup"));
    }
});

/**
 * update
 */
router.put('/stu', (req, res, next) => {
});




module.exports=router;