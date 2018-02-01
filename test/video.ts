
// const chai=require('chai');
import * as chai from 'chai';
// const should=chai.should();
const should=chai.should();
// const server=require('../app');
import server from '../app';
import { error } from 'util';
// const chai_http=require('chai-http');
// import * as chai_http from 'chai-http';
// import chai_http from 'chai-http';
const chai_http=require('chai-http');
chai.use(chai_http);

describe('VIDEOS',()=>{
    describe('GET VIDEO LIST',()=>{
        it('should return videos list',(done)=>{
            chai.request(server).get('/api/v1/course/1/video/list')
            .end((err,res:ChaiHttp.Response)=>{
                console.log(JSON.stringify(res.body));
               let body=res.body;
               body.should.have.property('count').that.is.a('number');
               done();
            });
        });
    });
});