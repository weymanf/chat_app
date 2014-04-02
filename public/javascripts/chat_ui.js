$(document).ready(function() {

	var socket = io.connect();
	var chat = new ChatNamespace.Chat(socket);

	var getMessage = function(event) {
		return $(event.currentTarget[0]).val();
	}

	$('#weyman').on('submit', function(event) {
		event.preventDefault();
		var msg = getMessage(event);
		if (msg.slice(0,1) == "/") {
			chat.processCommand(msg.slice(1));
		} else {
			chat.sendMessage(msg);
		}

		$('#weyminput').val("");
	});

	socket.on('message', function(data) {
		$('#chat').prepend('<p>' + data.username + ": " + data.text.haha + '</p>');
	});

	socket.on('listUsers', function(data) {
		console.log("in here")
		$('#users').html("")

		data.nicknames.forEach(function(user) {
			$('#users').append('<li>' + user + '</li>');
		});
	});

});
