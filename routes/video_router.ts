import * as express from 'express';
const applyErrorMW = require('../utils/async_middleware');
const router = express.Router();
import * as _path from 'path';
import * as fs from 'fs-extra';
import { pathExists } from 'fs-extra';
const getError=require('../utils/error');

const models =require('../models/models');
const file_path=__dirname+'/../public/videos/video1.mp4';


router.get(/^\/([0-9]+)$/, applyErrorMW(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let course_id=req.url_params['course_id'];
    const stat=await fs.stat(file_path);
    const fileSize= stat.size;
    const range:string=req.header.range;
    if(range){
        const parts = range.replace(/bytes=/,'').split('-');
        const start=parseInt(parts[0],10);
        const end=parts[1]?parseInt(parts[1],10):fileSize-1;

        const chunck_size=end-start+1;
        const file=fs.createReadStream(file_path,{start,end});
        const head={
            'Content-Range':`bytes ${start}-${end}/${fileSize}`,
            'Accepte-Ranges':'bytes',
            'Content-Length':chunck_size,
            'Content-Type':'video/mp4',
        };
        res.writeHead(206,head);
        file.pipe(res);
    }
    else{
        const head={
            'Content-Length':fileSize,
            'Content-Type':'video/mp4',
        }
        res.writeHead(200,head);
        fs.createReadStream(file_path).pipe(res);
    }
}));



router.get(/^\/list$/,applyErrorMW(async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    let course_id=req.url_params['course_id'];
    let videos=await models.Video.findAll({where:{course_id:course_id}});
    if(videos.length===0) throw getError(404,"Resoure not found");
    else{
        res.json({
            count:videos.length,
            data:videos,
        });
    }
}));

module.exports=router;