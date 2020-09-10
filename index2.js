const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const server = http.createServer(function (req, res) {
		res.write('Hello World!'); //write a response to the client
		res.end(); //end the response
	});
const wss1 = new WebSocket.Server({ noServer: true });

// console.log(server)

wss1.on('connection', function connection(ws) {
	// ...
});

server.on('upgrade', function upgrade(request, socket, head) {

	console.log(url.parse(request.url).pathname)

	const pathname = url.parse(request.url).pathname;

	if (pathname === '/foo') {
		wss1.handleUpgrade(request, socket, head, function done(ws) {
			wss1.emit('connection', ws, request);
		});
	} else {
		socket.destroy();
	}
});

server.listen(3000);