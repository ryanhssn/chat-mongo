
var moment = require('moment');

var generateMessage = (from, text, id) => {
	return {
		from,
		text,
		id,
		createdAt: moment().valueOf()
	}
}


var generateLocationMessage = (from, latitude, longitude) => {
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		latitude,
		longitude,
		createdAt: moment().valueOf()
	};
}

module.exports = {generateMessage, generateLocationMessage}
