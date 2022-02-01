//built-in dependencies
const http = require('http');

//server responses for api calls
const server = http.createServer(function(req, res) {
    res.end('Ola mundo');
});

//server listening
const PORT = 3000;
server.listen(PORT, function(){
    console.log('Server listening on port',PORT);
});