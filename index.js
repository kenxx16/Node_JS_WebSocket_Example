const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');


fs.readFile('assets/index2.html', function(err, data) {
	if (err){
		throw err;
	}
	htmlFile = data;
});

fs.readFile('assets/css/bootstrap.css', function(err, data) {
	if (err){
		throw err;
	}
	cssFile = data;
});

//------------------------------------------------------------------

fs.readFile('assets/script.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFile = data;
});

fs.readFile('assets/jquery-3.5.1.min.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFile += data;
});

fs.readFile('assets/js/bootstrap.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFile += data;
});

fs.readFile('assets/code/highcharts.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFileHC = data;
});

fs.readFile('assets/code/modules/heatmap.src.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFileHeat = data;
});

fs.readFile('assets/js/ampChart.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFileAmp = data;
});

fs.readFile('assets/js/getFoto.js', function(err, data) {
	if (err){
		throw err;
	}
	scriptFileFoto = data;
});


const server = http.createServer(function (req, res) {
	console.log(req.url);

	switch (req.url) {
		case "/script.js" :
			res.writeHead(200, {"Content-Type": "text/javascript"});
			res.write(scriptFile);
			res.end();
			break;

		case "/code/highcharts.js" :
			res.writeHead(200, {"Content-Type": "text/javascript"});
			res.write(scriptFileHC);
			res.end();
			break;
		case "/code/modules/heatmap.src.js" :
			res.writeHead(200, {"Content-Type": "text/javascript"});
			res.write(scriptFileHeat);
			res.end();
			break;
		case "/js/ampChart.js" :
			res.writeHead(200, {"Content-Type": "text/javascript"});
			res.write(scriptFileAmp);
			res.end();
			break;
		case "/js/getFoto.js" :
			res.writeHead(200, {"Content-Type": "text/javascript"});
			res.write(scriptFileFoto);
			res.end();
			break;
		case "/css/bootstrap.css" :
			res.writeHead(200, {"Content-Type": "text/css"});
			res.write(cssFile);
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

	// console.log(ws)
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

// child_process.execFile('tcp_client/Release/ASOPS_tcpclient.exe -offm_w capture151115.pscan ws://localhost:3000/data 1000');

server.listen(3000);