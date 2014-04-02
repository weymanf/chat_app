
var route = function(req, res) {
	if (req.url === "/") {
		fs.readFile('/public/index.html', function (err, data) {
			console.log(data);
		});

	} else {
		fs.readFile(req.url, function(err, data) {
			if (err)
				res.writeHead(404, {'Content-Type': "text/plain"});
			console.log(data);
		})
	}
}