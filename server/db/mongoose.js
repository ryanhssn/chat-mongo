var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017/chat-mongo')
mongoose.connect('mongodb://dbuser:dbpassword@ds111078.mlab.com:11078/chat-mongo-bh')

module.exports = {mongoose};
