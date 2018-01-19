const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Text} = require('./../models/text');

const texts = [{
	text: 'First test text'
}, {
	text: 'Second test text'
}]


beforeEach((done) => {
	Text.remove({}).then(() => {
		return Text.insertMany(texts);
	}).then(() => {
		done();
	})
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

			Text.find({text}).then((texts) => {
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
				expect(texts.length).toBe(2);
				done();
			}).catch((e) => {
				done(e);
			})

	})	

})

describe('GET /texts', () => {
	it('should get all the texts', (done) => {
		request(app)
			.get('/texts')
			.expect(200)
			.expect((res) => {
				expect(res.body.texts.length).toBe(2);
			})
			.end(done);
	})
})