
window.onload = function () {
// создать подключение
	var socket = new WebSocket("ws://localhost:3000/data");

// отправить сообщение из формы publish
	document.forms.publish.onsubmit = function () {
		var outgoingMessage = this.message.value;
		socket.send(this.message.value);
		// socket.send(this.port.value);
		return false;
	};

// обработчик входящих сообщений
	socket.onmessage = function (event) {
		// console.log(event.data);
		var incomingMessage = event.data;
		console.log(JSON.parse(incomingMessage));
		// showMessage(incomingMessage);
	}

// показать сообщение в div#subscribe
// 	function showMessage(message) {
// 		var messageElem = document.createElement('div');
// 		messageElem.appendChild(document.createTextNode(message));
// 		document.getElementById('subscribe').appendChild(messageElem);
// 	}
};
