"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const should = chai.should();
const app_1 = require("../app");
const chai_http = require('chai-http');
chai.use(chai_http);
describe('VIDEOS', () => {
    describe('GET VIDEO LIST', () => {
        it('should return videos list', (done) => {
            chai.request(app_1.default).get('/api/v1/course/1/video/list')
                .end((err, res) => {
                console.log(JSON.stringify(res.body));
                let body = res.body;
                body.should.have.property('count').that.is.a('number');
                done();
            });
        });
    });
});
