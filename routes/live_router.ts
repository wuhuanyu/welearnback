import * as Express from 'express';
const Live =require('../models/models').Live;
const ErrorMW = require('../utils/error').errMW;
const LiveRouter:Express.Router = Express.Router();
const TAG='LiveRouter';
const redis=require('../globals').redis;
const md5 =require('md5');
const livekey="private";
const Models =require('../models/models');
const getError=require('../utils/error');
const mqtt=require('../gl')
LiveRouter.post('',ErrorMW(async (req:Express.Request,res:Express.Response,next:Express.NextFunction)=>{
    let course_id=req.url_params['course_id'];
    //can not have a reserved live already
    let found=await Live.findOne({
        where:{
            course_id:course_id,
            finish:false,
        }
    });
    if(found){
        throw getError(401,"Already has a live reserved");
    }
    //todo: check
    //time is milliseconds
    let {title,time}=req.body;

    let auth:object=req.auth;

    /**
     * authentication start
     */
    let expire=((+time)+10*60*1000)/1000|0;
    let hash=md5(`/live/course${course_id}-${expire}-${livekey}`);
    /**
     * authentication stop here
     */
    let url=`/live/course${course_id}?sign=${expire}-${hash}`;


    let savedLive=await Live.build({
        course_id:course_id,
        teacher_id:auth.id,
        title:title,
        time:time,
        url:url,
    }).save();
        res.json({
            result:savedLive.id,
        }).end();
}));

LiveRouter.get('',ErrorMW(async(req:Express.Request,res:Express.Response,next:Express.NextFunction)=>{
    let course_id=req.url_params['course_id'];
    let lives=await Live.findAll({
        where:{
            course_id:course_id
        }
    });
    if(lives.length===0)
        throw  getError(404,'No such resource');
    res.json({
        count:lives.length,
        data:lives,
    }).end();
}));

// LiveRouter.get('',ErrorMW(async(req:Express.Request,res:Express.Response,)))

LiveRouter.patch(/\/([0-9]+)$/,ErrorMW(async(req:Express.Request,res:Express.Response,next:Express.NextFunction)=>{
    let course_id=req.url_params['course_id'];
    let live_id=+(req.params[0]);


    let live=await Live.findOne({
        where:{
            id:live_id,
            course_id:course_id
        }
    });
    if(!live) throw getError(404);
    console.log(req.body);
    await live.update(req.body);

    res.json({
        result:live.id
    }).end();
}));

LiveRouter.delete(/\/([0-9]+)$/,ErrorMW(async(req:Express.Request,res:Express.Response,next:Express.NextFunction)=>{
    let course_id=req.url_params['course_id'];
    let live_id=+(req.params[0]);
    let found=await Live.findOne({
        where:{
            id:live_id,
            course_id:course_id,
        }
    });
    if(!found)
        throw getError(404);
    else{
        await found.destory();
        res.end();
    }
}));

export default LiveRouter;