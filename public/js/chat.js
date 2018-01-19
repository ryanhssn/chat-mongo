var socket = io()


function scrollToBottom() {
		var messages = jQuery('#messages');
		var newMessage = messages.children('li:last-child')

		var clientHeight = messages.prop('clientHeight');
		var scrollTop = messages.prop('scrollTop');
		var scrollHeight = messages.prop('scrollHeight')
		var newMessageHeight = newMessage.innerHeight();
		var lastMessageHeight = newMessage.prev().innerHeight();

		if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
			messages.scrollTop(scrollHeight)
		}
}

socket.on('connect', function() {
	console.log('connected to server');
	var params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function(err) {
		if(err) {
			alert(err);
			window.location.href = "/";
		} else {
			console.log('No Error');

		}
	});
	// socket.emit('createMessage', {
	// 	from: 'client@bilal-h.com',
	// 	text: 'Hey, checking my own written custom chat app.'
	// })
});

socket.on('disconnect', function() {
	console.log('disconnected to server');
});

socket.on('updateUserList', function(users) {
	var ol = jQuery('<ol></ol>');

	users.forEach(function(user) {
		ol.append(jQuery('<li></li>').text(user))
	})

	jQuery('#users').html(ol);
})

socket.on('loadConversation', function(message) {
	console.log('conversation ',message)
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var chatScreen = jQuery('#message-template').html();
	var html;
	message.forEach(function(text) {
		html += Mustache.render(chatScreen, {
			text: text.text,
			from: 'Bilal Hussain',
			createdAt: formattedTime
		})	
	})

	

	jQuery('#messages').append(html);

	scrollToBottom();
})

socket.on('newMessage', function(message) {
	console.log('newMessage ',message)
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);

	scrollToBottom();

})

socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');

	var template = jQuery('#location-message-template').html();
	console.log(message)
	var html = Mustache.render(template, {
		url: message.url,
		latitude: message.latitude,
		longitude: message.longitude,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);

	scrollToBottom();
})


jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();

	var messageTextBox = jQuery('[name=message]')

	socket.emit('createMessage', {
		text: messageTextBox.val()
	}, function() {
		messageTextBox.val('')
	})
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled')

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('sending location....')
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	}, function () {
		alert('Unable to fetch location, using default');
		locationButton.removeAttr('disabled');
		socket.emit('createLocationMessage', {
			latitude: "40.7127837",
			longitude: "-74.00594130000002"
		})
	})
})
