process.env.NODE_ENV = 'test';

const models = require('../models/models');
const Bulletin = models.Bulletin;
const chai_as_promised = require('chai-as-promised');
const chai = require('chai');
let chai_http = require('chai-http');
let server = require('../app');

let should = chai.should();

chai.use(chai_http);
// chai.use(chai_as_promised);

describe('Bulletins', () => {
	before(async () => {
		await Bulletin.drop();
		await Bulletin.sync();
		await Bulletin.build({
			body:'明天不上课',
			course_id:1,
			publisher_id:1,
			publish_time:new Date().getTime()
		}).save();
	}); 

	//test get
	describe('GET /bulletin', () => {
		it('it should have no bulletins', (done) => {
			chai.request(server).get('/api/v1/course/1/bulletin').end((err, res) => {
				res.should.have.status(200);
				let body = res.body;
				body.should.have.property('count').that.is.a('number').that.equal(1);
				done();
			});
		});
	});
	//test post 
	describe('POST /bulletin', () => {
		it('it should post a bulletin', (done) => {
			let bulletin = { body: '下周开会' };
			chai.request(server).post('/api/v1/course/1/bulletin')
				.set('authorization', 'TXJaaGFvOnBhc3M6MTE=')
				.set('content-type', 'application/json')
				.send(bulletin).end((err, res) => {
					res.should.have.status(200);
					let body = res.body;
					body.should.have.property('result').that.is.a('number');
					body.should.have.property('msg');
					done();
				});
		});
		it('it should be rejected due to authentication',(done)=>{
			let bulletin = { body: '下周开会' };
			chai.request(server).post('/api/v1/course/1/bulletin')
				.set('authorization', 'TXJaaGFvOnBhc3M6MTI=')
				.set('content-type', 'application/json')
				.send(bulletin).end((err, res) => {
					res.should.have.status(403);
					done();
				});
		});
	});
});