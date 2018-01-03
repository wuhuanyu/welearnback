const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const upload=multer({dest:path.resolve(__dirname,'../uploads')});

// const folderDir=path.resolve(__dirname,"../uploads");

/**
 * post /file
 */
router.post('',(req,res,next)=>{
    let aT=req.query.aT,//author type
        aId=req.query.aId,//author id,
        forT=req.query.forT,//for what kind of file 
        fId=req.query.fId, //for what file
        fT=req.query.fT; //file type,ie image or common file
     if()
});


module.exports=router;