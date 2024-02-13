const http = require('http');
const fs = require('fs');
const ws = require('ws');

var app = express();
var cors = require('cors')

app.use(cors())
app.listen(port, function () {
  console.log('Example app listening on port 3000.');
});

const clients = new Set();

function accept(req, res) {
    fs.createReadStream('./index.html').pipe(res);
}

const httpServer = http.createServer(accept).listen(8083);
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