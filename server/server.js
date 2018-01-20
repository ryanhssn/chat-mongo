const _ = require('lodash');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io')
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Text} = require('./models/text');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');


var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const port = process.env.PORT || 3000;




app.use(bodyParser.json())

app.post('/texts', (req, res) => {
	var text = new Text({
		text: req.body.text
	})

	text.save().then((doc) => {
		res.send(doc)
	}, (e) => {
		res.status(400).send(e);
	})

});

app.get('/texts', (req, res) => {
	Text.find().then((texts) => {
		res.send({texts});
	}, (e) => {
		res.status(400).send(e);
	})
})

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['name', 'email', 'password']);
	var user = new User(body);

	user.save().then((user) => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e)
	})
})

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
})

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['name', 'email', 'password']);


	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		})
	}).catch((e) => {
		res.status(400).send(e);
	})
})

app.use(express.static(publicPath));

io.on('connection', (socket) => {


		socket.on('join', (userId, callback) => {
			//console.log('mongo id is', userId);
			// if(!isRealString(params.name) || !isRealString(params.room)){
			// 	return callback('name are room name are required');
			// }

			User.findOne({
				_id:userId
			}).then((user) => {

					console.log(`new user connected : ${user.name}`);

					 socket.join('conversation')
					 //users.removeUser(socket.id);
					 users.addUser(socket.id, user.name, 'conversation')
		      //
		      //
					// io.to(params.room).emit('updateUserList', users.getUserList(params.room))
					socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app, ${user.name}`));

					/*load conversation*/
					Text.find().then((texts) => {
							//res.send({texts});
							socket.emit('loadConversation', {userId, texts});
						}, (e) => {
							console.log('Error lodading conversation ', e)
				})

				})

			//socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
			callback();
		});

		socket.on('createMessage', (message, callback) => {
			//console.log(message);
			var user = users.getUser(socket.id);

			if (user && isRealString(message.text)) {

				var text = new Text({
						text: message.text,
						_creatorId: message.creatorId,
						_creatorName: message.creatorName
					})
					text.save().then((doc) => {

					}, (e) => {

					})

				io.to(user.room).emit('newMessage', generateMessage(user.name, message.text, message.creatorId))
			}

			callback();
		})

		socket.on('createLocationMessage', (coords) => {
			var user = users.getUser(socket.id);

			if(user){
				io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
			}
		})


	socket.on('disconnect', function() {
		console.log('user disconnected');

		var user = users.removeUser(socket.id);

		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the group`));
		}
	});
})


server.listen(port, () => {
	console.log(`Started on port ${port}`)
})

module.exports = {app};
