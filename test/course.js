process.env.NODE_ENV = 'test';

const models = require('../models/models');
const chai = require('chai');
const chai_http = require('chai-http');
const server = require('../app');
const constants = require('../constants');

chai.use(chai_http);
let should = chai.should();


describe('CourseRouter', () => {
	before(async () => {
		await models.Comment.remove({});
	});

	describe('POST course comment', () => {
		it('it should post comment successfully', (done) => {
			chai.request(server).post('/api/v1/course/1/comment')
				.set('authorization', 'U3RhY2s6cGFzczoxMg==')
				.send({ body: 'comment to course1' })
				.end((err, res) => {
					res.body.should.have.a.property('result').that.is.a('string');
					res.should.have.status(200);
					res.body.should.have.property('msg');
					done();
				});
		});
	});

	describe('GET MESSAGE', () => {
		it('it should return comments of course 1', (done) => {
			chai.request(server).get('/api/v1/course/1/comment')
				.end((err, res) => {
					console.log(JSON.stringify(res.body));
					res.should.have.status(200);
					res.body.should.have.property('count').that.is.a('number');
					res.body.should.have.property('data').that.is.a('array');
					done();
				});
		});
	});

	describe('GET STUDENTS',()=>{
		it('it should return all students that select the course',(done)=>{
			chai.request(server).get('/api/v1/course/1/users')
				.end((err,res)=>{
					console.log(JSON.stringify(res.body));
					res.body.should.have.property('count').that.is.a('number');
					res.body.should.have.property('data').that.is.a('array');
					done();
				});
		});
	});
});