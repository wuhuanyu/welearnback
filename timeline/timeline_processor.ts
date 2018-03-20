import * as express from 'express';
import * as path from 'path';

import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParse from 'cookie-parser';
import * as mongo from 'mongoose';

const applyErrorMW=require('../utils/async_middleware');
mongo.Promise=global.Promise;

mongo.connect('mongodb://localhost:27017/welearn');


const app=express();
app.use(bodyParser);
app.use(morgan('dev'));
app.post('',applyErrorMW(async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.status(200).end();
}));


module.exports=app;