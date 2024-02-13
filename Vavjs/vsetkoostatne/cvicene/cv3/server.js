const http = require('http');
const fs = require('fs');
const ws = require('ws');


const clients = new Set();

function accept(req, res) {
    fs.createReadStream('./index.html').pipe(res);
}

const httpServer = http.createServer(accept).listen(80);
const wss = new ws.WebSocketServer({ server: httpServer });

wss.on("connection", function(connection) {
    console.log(connection);
    connection.on("message", function(mes) {
        return new Promise(function(result, reject) {
            setTimeout(function() {
                connection.send(mes + 1)
            }, 5000);
        })
    });
})

/*
const http = require('http');
const ws = require('ws');//new WebSocket('ws://localhost:80');

const requestListener = function (req, res) {
  res.writeHead(200,{'Content-Type': 'text/html'});
  res.end('<input type="text" id="fname" name="fname"><br><br><button onclick="myFunction()"type="button">Submit</button><p id="demo"></p><script>function myFunction() {document.getElementById("demo").innerHTML = document.getElementById("fname").value;}</script>');
}

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
// Create WebSocket connection.

const socket = new WebSocket('ws://localhost:8080');
// Connection opened
socket.addEventListener('open', function (event) {
socket.send('Hello Server!');
});
// Listen for messages
socket.addEventListener('message', function (event) {
console.log('Message from server ', event.data);
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 82 });
wss.on('connection', function connection(ws) {
ws.on('message', function incoming(message) {
console.log('received: %s', message);
ws.send(JSON.stringify({"a": "b"}));
});
});

const server = http.createServer(requestListener);
server.listen(80);
*/