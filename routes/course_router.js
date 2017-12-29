const router = require('express').Router();
import Course from '../models/course';
const getError = require('../utils/error');
const findByFieldFactory =require('../utils/commonquery');


const TAG = "[CourseRouter]: ";
/**
 * tested
 */
router.post('', (req, res, next) => {
    let b = req.body;
    if (['name', 'desc'].every(f => {
        return Object.keys(b).indexOf(f) > -1;
    })) {
        let n = b.name, d = b.desc;
        let newC = Course.build({
            name: n,
            desc: d,
        });
        newC.save().then(savedC => {
            res.status(200).json({
                result: savedC.id,
                msg: "Course Uploaded Successfully"
            });
        });
    } else {
        next(getError(400, "Course Wrong Format"));
    }
});

/**
 * /api/v1/course/:id
 * tested
 */
router.get(/^\/([0-9]+)$/, (req, res, next) => {
    let id = req.params[0];
    // console.log(TAG + req.params[0]);
    if (!isNaN(id)) {
        Course.findById(+id).then(foundC=>{
            if(foundC){
                res.status(200).json({
                    count:1,
                    data:foundC,
                })
            }else{
                next(getError(404,"Resource Not Found"));
            }
        });
    };
});
/**
 * tested
 * http://localhost:3000/api/v1/course?name=Art
 */
router.get('',(req,res,next)=>{
    let n=req.query.name;
    console.log(TAG+n);
    Course.findOne({where:{name:n}}).then(foundC=>{
        if(foundC){
            res.status(200).json({
                count:1,
                data:foundC
            });
        }
        else{
            next(getError(404,"Resource Not Found"));
        }
    });
});


/**
 * post question of a certain question
 * /23/question
 */
 router.post(/^\/([0-9]+)\/question\$/,(req,res,next)=>{
     
 });
export default router;