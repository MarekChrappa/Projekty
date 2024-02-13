const { server } = require('./server.js');

const port = 8080;

server.listen(8080, () => {
    console.log('listening on port ' + port);
});