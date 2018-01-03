const multer = require('multer');
const _path = require('path');
const commonFileDest=_path.resolve(__dirname,'../uploads');
const imageDest=_path.resolve(__dirname,'../uploads/images');
import * as Constants from '../constants';

import {isImage} from '../utils/check';
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        if(isImage(file.originalname)){
            cb(null,imageDest);
        }
        else {
            cb(null,commonFileDest);
        }
    },
    filename:function(req,file,cb){
        cb(null,new Date().getTime()+file.originalname);
    }
});
const upload=multer({storage:storage});

const defaultConfig=upload.fields([{name:'upload',maxCount:5}]);
export default upload;
export {defaultConfig};