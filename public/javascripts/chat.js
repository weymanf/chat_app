(function(root) {
	var ChatNamespace = root.ChatNamespace = (root.ChatNamespace || {});

	var Chat = ChatNamespace.Chat = function(socket) {
		this.socket = socket;
	}

	Chat.prototype.sendMessage = function(data) {
		this.socket.emit('message', { haha: data });
	}

	Chat.prototype.processCommand = function(msg) {
		var command = msg.split(" ")[0];
		var data = msg.split(" ")[1];

		if (command === "nick") {
      console.log(data);
			this.socket.emit('nickname', { username: data })
		} else if (command === "join") {
			this.socket.emit('join', { room: data });
		} else {
			alert('invalid command');
		}
	}

}(this));