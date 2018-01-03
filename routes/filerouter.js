const router = require('express').Router();
const multer = require('multer');
const _path = require('path');
const commonFileDest=_path.resolve(__dirname,'../uploads');
const imageDest=_path.resolve(__dirname,'../uploads/images');
import * as Constants from '../constants';
// const upload = multer({ dest: _path.resolve(__dirname, '../uploads') });
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        let fT=+req.query.fT;
        if(fT===Constants.FT_IMAGE){
            cb(null,imageDest);
        }
        else if(fT===Constants.FT_FILE){
            cb(null,commonFileDest);
        }
    }
});
const upload=multer({storage:storage});
const UploadFile = require('../models/models').UploadFile;

const multipleUp = upload.fields([{ name: "upload", maxCount: 5 }]);
// const folderDir=path.resolve(__dirname,"../uploads");
const TAG = "[FileUploadRouter]: ";
/**
 * post /file
 */

/**
 * {"fieldname":"up","originalname":"references.docx","encoding":"7bit","mimetype":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","destination":"/Users/stack/Documents/code/node/WeLearnBack/uploads","filename":"d9d586488433cb74474d6180d391b513","path":"/Users/stack/Documents/code/node/WeLearnBack/uploads/d9d586488433cb74474d6180d391b513","size":27695}
 */

router.post('', multipleUp, (req, res, next) => {

    // console.log(JSON.stringify(req.body));
    let aT = req.query.aT,//author type
        aId = req.query.aId,//author id,
        forT = req.query.forT,//for what kind of file 
        fId = req.query.fId, //for what file
        fT = req.query.fT; //file type,ie image or common file
    let files = req.files['upload'];
    let savePromsies = files.map(file => {
        let { originalname, size, filename, path } = file;
        let newF = UploadFile.build({
            aT: aT,
            aId: aId,
            forT: forT,
            fId: fId,
            fT: fT,
            original_name: originalname,
            name: filename,
            dir: path,
        });
        return newF.save();
    });
    Promise.all(savePromsies).then(saved=>{
        res.status(200).json({
            msg:"Files Upload Successfully"
        });
    });
});

/**
 * download file
 */

 
router.get('/download',(req,res,next)=>{
    let id=req.query.id;
    UploadFile.findById(id).then(found=>{
        if(found){
            let dir=found.dir;
            res.download(dir);
        }
    });
});


module.exports=router;