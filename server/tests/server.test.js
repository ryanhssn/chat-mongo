const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Text} = require('./../models/text');

beforeEach((done) => {
	Text.remove({}).then(() => done());
})


describe('POST /texts', () => {
	it('should create a new text', (done) => {
		var text = 'Text message';

		request(app)
		.post('/texts')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}

			Text.find().then((texts) => {
				expect(texts.length).toBe(1)
				expect(texts[0].text).toBe(text);
				done();
			}).catch((e) => {
				done(e);
			})
		})
	})

	it('should not create user with invalid data', (done) => {
		request(app)
			.post('/texts')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
			})

			Text.find().then((texts) => {
				expect(texts.length).toBe(0);
				done();
			}).catch((e) => {
				done(e);
			})

	})	

})