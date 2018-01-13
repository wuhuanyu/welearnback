process.env.NODE_ENV='test';

const models=require('../models/models');
const chai_as_promised=require('chai-as-promised');
const chai=require('chai');
const chai_http=require('chai-http');
const server=require('../app');
const constants=require('../constants');

let should=chai.should();

describe('MessagesRouter', () => {
    before(async () => {
        await models.MessageRecipient.drop();
        await models.Message.drop();
        await models.Message.sync();
        await models.MessageRecipient.sync();
    });

    describe('POST MESSAGE', () => {
        it('it should post a message successfully',(done)=>{
            chai.request(server).post('/api/v1/course/1/message')
            .set('authorization','TXJaaGFvOnBhc3M6MTE=')
            .set('content-type','application/json')
            .send({body:'明天放假',type:constants.ACC_T_Tea}).end((err,res)=>{
                console.log(JSON.stringify(res.body));
                res.body.should.have.property("result").that.is.a('number');
                res.body.should.have.property('msg').that.is.a('string').to.be.equal('Message send successfully');
                done();
            })
        })
    });

    describe('GET MESSAGE', () => {
        it('should get a message',(done)=>{
            chai.request(server).get('/api/v1/course/1/message?count=1')
            .set('authorization','TXJaaGFvOnBhc3M6MTE=')
            .set('content-type','application/json')
            .end((err,res)=>{
                console.log(JSON.stringify(res.body));
                res.should.have.status(200);
                res.body.should.be.a('object').that.have.property('count').that.is.a('number');
                res.body.should.be.a('object').that.have.property('data').that.is.a('array');
                done();
            })
        })
    });
});