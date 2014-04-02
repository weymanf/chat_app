// var app = require('http');
// var fs = require('fs');
var guestnumber = 1;
var nicknames = {"sadasd": "weyman"};
var currentRooms = { "lobby": [] };

var io = require('socket.io');

var joinRoom = function (socket, room) {
	socket.join(room)
	if (!currentRooms[room])
		currentRooms[room] = [];
	currentRooms[room].push(nicknames[socket.id]);
}


var socketRoom = function(socket) {
	var currentRoom;

	for(var room in currentRooms) {
		currentRooms[room].forEach( function( user) {
			if (user === nicknames[socket.id])
				currentRoom = room;
		});
	}

	return currentRoom;
}


var createChat = function(server) {
	var theio = io.listen(server);

	theio.sockets.on('connection', function(socket) {
		console.log("yooyoyoyoyo");

		var guestUsername = "guest_" + guestnumber;
		nicknames[socket.id] = guestUsername;
		guestnumber += 1;

		joinRoom(socket, "lobby");

		//list users
		theio.sockets.in(socketRoom(socket)).emit('listUsers', { nicknames: currentRooms[socketRoom(socket)] });

		//emits messages
		socket.on('message', function(data) {
			console.log(currentRooms);
			theio.sockets.emit('message', { text: data, username: nicknames[socket.id]});
		});

		socket.on('join', function(data) {
			var room = socketRoom(socket);
			socket.leave(room);

			var our_index = currentRooms[room].indexOf(nicknames[socket.id]);
			if (our_index > -1) {
				currentRooms[room].splice(our_index, 1);
			}

			joinRoom(socket, data.room);
			console.log(currentRooms);

			// tell new room to re-render
			theio.sockets.in(socketRoom(socket)).emit('listUsers', { nicknames: currentRooms[socketRoom(socket)] });

			// tell old room to re-render
			theio.sockets.in(room).emit('listUsers', { nicknames: currentRooms[room] });
		});

		socket.on('nickname', function(data) {
			var allnames = [];
			for (var user in nicknames) {
				allnames.push(nicknames[user])
			};

			var username = data.username

			var taken = false;
			allnames.forEach(function(uname) {
				if (uname === username) {
					taken = true;
				}
			});

			if (taken) {
				socket.emit('nickname', {
					success: false,
					message: 'Username already taken'
				});
			} else {
        var users = currentRooms[socketRoom(socket)];
        var myIndex = users.indexOf(nicknames[socket.id]);

        users[myIndex] = username;        
				nicknames[socket.id] = username;
        
				theio.sockets.in(socketRoom(socket)).emit('listUsers', { nicknames: currentRooms[socketRoom(socket)] });
			}
				console.log(nicknames);
			// for (var username in nicknames)
		});

		socket.on('end', function() {
			var currentUser = nicknames[socket.id];
			delete nicknames[socket.id];
			console.log(nicknames);

			theio.sockets.in(socketRoom(socket)).emit('listUsers', { nicknames: currentRooms[socketRoom(socket)] });
			var msg = currentUser + " has left the room.";
			// emit that he left
		});

	});
}

module.exports = createChat;