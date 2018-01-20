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
	},
	_creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	_creatorName: {
		type: String,
		required: true
	}
});

module.exports = {Text}
