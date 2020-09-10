const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');



fs.readFile('assets/index.html', function(err, data) {
	if (err){
		throw err;
	}
	htmlFile = data;
});
fs.readFile('assets/style.css', function(err, data) {
	if (err){
		throw err;
	}
	cssFile = data;
});
fs.readFile('assets/script.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFile = data;
});


const server = http.createServer(function (req, res) {


	switch (req.url) {

		case "/style.css" :
			res.writeHead(200, {"Content-Type": "text/css"});
			res.write(cssFile);
			res.end();
			break;
		case "/script.js" :
			res.writeHead(200, {"Content-Type": "text/javascript"});
			res.write(scriptFile);
			res.end();
			break;
		default:
			res.
			writeHead(200, {"Content-Type": "text/html"});
			res.write(htmlFile);
			res.end();
	}
		// res.write('Hello World!'); //write a response to the client
		// res.end(); //end the response
	});
const wss1 = new WebSocket.Server({ noServer: true });

// console.log(server)
// подключённые клиенты
var clients = {};
wss1.on('connection', function connection(ws) {

	console.log(ws)
	// ...
	var id = Math.random();
	clients[id] = ws;
	console.log("новое соединение " + id);

	ws.on('message', function(message) {
		console.log('получено сообщение ' + message);

		for (var key in clients) {
			clients[key].send(message);
		}
	});

	ws.on('close', function() {
		console.log('соединение закрыто ' + id);
		delete clients[id];
	});
});

server.on('upgrade', function upgrade(request, socket, head) {

	// console.log(url.parse(request.url).pathname)

	const pathname = url.parse(request.url).pathname;

	if (pathname === '/data') {
		wss1.handleUpgrade(request, socket, head, function done(ws) {
			wss1.emit('connection', ws, request);
		});
	} else {
		socket.destroy();
	}
});

server.listen(3000);