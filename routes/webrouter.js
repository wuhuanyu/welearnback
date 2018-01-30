const router=require('express').Router();
const fs=require('fs');
router.get('/',(req,res,next)=>{
    res.render('index',{title:'WeLearn'});
});

router.get('/video',(req,res,next)=>{
    fs.createReadStream(__dirname+'/../views/video.html').pipe(res);
});

module.exports=router;