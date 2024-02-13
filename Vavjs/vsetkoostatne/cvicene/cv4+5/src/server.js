const http = require('http');
const fs = require('fs');
const inc = require('./inc.js');

let connectionMade = false;
let connection = null;


function connectDB() {//pripojenie na db
    if(connectionMade===false) {
        connection = mysql.createConnection({
            host     : process.env.HOST,
            user     : process.env.USER,
            password : process.env.PASSWORD,
            database : process.env.NAME
        });
        connection.connect(err =>{
            if(!err) {
                connectionMade = true;
            }
        });
    }
}

const server = http.createServer((req, res) => {
    console.log('url: ' + req.url);
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile('./src/public/index.html', (err, data) => {
            if (err) {
                res.end('ERROR');
                return;
            }
            res.end(data);
        });
    } else if (req.url === '/func' && req.method === 'POST') {
        let chunks = [];

        req.on('data', (data) => {
            chunks.push(data);
        })
        req.on('end', () => {
            const resData = chunks.join('');
            let jData = {};
            try {
                jData = JSON.parse(resData);
            } catch (e) {
                console.error(e);
            }
            res.end(JSON.stringify({
                result: inc.inc(parseInt(jData.num))
            }));
        });
    }   else if (req.url === '/load' && req.method === 'GET') {
        connectDB();
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT ALL' + function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            res.end(JSON.stringify({
                placetype: req.params.placetype,
                places: results
            }));
        });

    }
});

module.exports = { server };