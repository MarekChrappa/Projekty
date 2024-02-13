const http = require('http');
const fs = require('fs');
const inc = require('./inc.js');

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
    }
});

module.exports = { server };