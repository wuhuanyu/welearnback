const router=require('express').Router();

router.get('/',(req,res,next)=>{
    res.render('index',{title:'WeLearn'});
});


module.exports=router;