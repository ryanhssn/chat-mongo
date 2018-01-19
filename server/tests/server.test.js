const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Text} = require('./../models/text');
const {User} = require('./../models/user');
const {users, populateUsers} = require('./seed/seed');

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

beforeEach(populateUsers);


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

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
         request(app)
           .get('/users/me')
           .set('x-auth', users[0].tokens[0].token)
           .expect(200)
           .expect((res) => {
             expect(res.body._id).toBe(users[0]._id.toHexString());
             expect(res.body.email).toBe(users[0].email);
           })
           .end(done);
     })


	it('should return 401 if not authenticated', (done) => {
         request(app)
           .get('/users/me')
           .expect(401)
           .expect((res) => {
             expect(res.body).toEqual({});
           })
           .end(done);
 
     })


});


describe('POST /users', () => {
     it('should create a user', (done) => {
       var email = 'example@gmail.com';
       var password = 'bilal@123';

       request(app)
       	.post('/users')
       	.send({email, password})
       	.expect(200)
       	.expect((res) => {
       		expect(res.headers['x-auth']).toExist();
       		expect(res.body._id).toExist();
       		expect(res.body.email).toBe(email)
       	}).
       	end((err) => {
       		if(err) {
       			return done(err);
       		}

       		User.findOne({email}).then((user) => {
       			expect(user).toExist();
       			expect(user.password).toNotBe(password);
       			done();
       		})
       	})
     })
 
     it('should return validation error if request invalid', (done) => {
       var email = 'invalid';
       var password = 'sdfsfsf'
 
       request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done);
 
     })
 
     it('should not create user if email is use', (done) => {
         var email = 'bilal@gmail.com';
         var password = 'sdfsfsf'
 
       request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done);
 
     })  
  }) 