const router = require('express').Router();
const stuCheckedFields=['name','password','gender'];


/**
 * student signup
 */

router.post('/stu', (req, res, next) => {
    let uBody=req.body;
    let keys=Object.keys(uBody);
    //check fields must have name,password,gender
    if(stuCheckedFields.every(f=>keys.indexOf(f)>-1)){
        
    }
});
/**
 * update
 */
router.put('/stu',(req,res,next)=>{

});


module.exports=router;