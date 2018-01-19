var mongoose = require('mongoose');

var Text = mongoose.model('Text', {
	text: {
		type: String,
		required: true,
		minlenght: 1,
		trim: true
	},
	recievedAt: {
		type: Number
	}
});

module.exports = {Text}