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
				url: 'http://localhost:3000/users/login',
				method: 'POST',
				data: jsonData( loginUsers ),
				crossDomain: true,
				contentType: 'application/json',
				success: function(data){
					window.location.href = "/chat.html"
				},
				error: function(err){
					console.log(err)
				}
			})
			
		})

		postUsers.on('submit', function( e ) {
			e.preventDefault();
			$('.error-post').text('')
			$.ajax({
				url: 'http://localhost:3000/users',
				method: 'POST',
				data: jsonData( postUsers ),
				crossDomain: true,
				contentType: 'application/json',
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'Authorization', 'Basic username: password');
				},
				success: function(data){
					window.location.href = "/chat.html"
				},
				error: function(err){
					console.log(err)
					$('.error-post').text(`Error ${err.status} - ${err.statusText}`)
					postUsers[0].reset();
				}
			})
			
		})