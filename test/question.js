process.env.NODE_ENV='test';
const chai=require('chai');
const chai_http=require('chai-http');

chai.use(chai_http);
const should=chai.should();
const models=require('../models/models');
const server=require('../app');
const constants=require('../constants');

describe('QUESTION', () => {
    before(async () => {
        await models.Question.remove({});
        await new models.Question({
            type:constants.QA,
            cId:1,
            tId:1,
            body:'what is your name',
            time:new Date().getTime(),
        }).save();
    });

    describe('GET QUESTION', () => {
        it('should get questions',(done)=>{
            chai.request(server).get('/api/v1/course/1/question')
                .end((err,res)=>{
                    console.log(JSON.stringify(res.body));
                    res.should.have.status(200);
                    res.body.should.have.property('count').that.is.a('number');
                    done();
                });
        });
    });
    
    describe('POST QUESTION', () => {
        it('should post question',(done)=>{
            chai.request(server).post('/api/v1/course/1/question')
                .set('authorization','TXJaaGFvOnBhc3M6MTE=')
                .set('content-type','application/json')
                .send({body:'what is your name?',type:32})
                .end((err,res)=>{
                    if(err){
                        console.log(err.message);
                    }
                    res.should.have.status(200);
                    res.should.have.property('result').that.is.a('number');
                });
            done();
        });
    });
    
});