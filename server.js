var createChat = require('./lib/chat_server');

var statik = require('node-static');

var file = new statik.Server('./public');

var http = require('http');

var server = http.createServer(function (request, response) {
	request.addListener('end', function() {
		file.serve(request, response);
	}).resume();
});

server.listen(8888);

createChat(server);

// function handler(req, res) {
// 	fs.readFile(__dirname + '/index.html',
// 	function(err, data) {
// 		if (err) {
// 			res.writeHead(500);
// 			return res.end('Error loading index.html');
// 		}
//
// 		res.writeHead(200);
// 		res.end(data);
// 	});
// }