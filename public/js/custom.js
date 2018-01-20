var postUsers = $('#post-users');
var loginUsers = $('#login-users');

		var jsonData = function ( form ) {
			var arrData = form.serializeArray(),
			objData = {};

			$.each( arrData, function( index, elem ) {
				objData[elem.name] = elem.value;
			})

			return JSON.stringify( objData );
		};



		loginUsers.on('submit', function( e ) {
			e.preventDefault();

			$.ajax({
				url: 'https://chat-mongo-bh.herokuapp.com/users/login',
				method: 'POST',
				data: jsonData( loginUsers ),
				crossDomain: true,
				contentType: 'application/json',
				success: function(data){

					localStorage.setItem('userData', data._id);
					localStorage.setItem('userName', data.name)
					window.location.href = "/chat.html"
				},
				error: function(err){
					console.log(err)
					$('.error-login').text(`Error ${err.status} - ${err.statusText}`)
					loginUsers[0].reset();
				}
			})

		})

		postUsers.on('submit', function( e ) {
			e.preventDefault();
			$('.error-post').text('')
			$.ajax({
				url: 'https://chat-mongo-bh.herokuapp.com/users',
				method: 'POST',
				data: jsonData( postUsers ),
				crossDomain: true,
				contentType: 'application/json',
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'Authorization', 'Basic username: password');
				},
				success: function(data){
					localStorage.setItem('userData', data._id);
					localStorage.setItem('userName', data.name);
					window.location.href = "/chat.html"
				},
				error: function(err){
					console.log(err)
					$('.error-post').text(`Error ${err.status} - ${err.statusText}`)
					postUsers[0].reset();
				}
			})

		})
