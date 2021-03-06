// built-in dependencies
const http = require('http');
const https = require('https')
const config = require('./config')
const fs = require('fs');
const _data = require('./lib/data');

// TESTING
// @TODO delete this

// _data.read({dir: 'test3', file: 'newFile', callback: function(err, data){
//     if(err) throw err;
//     console.log('Data from the file', data)
// }})

_data.delete({dir: 'test2', file: 'newFile', callback: function(err){
    console.log('This was the error:', err)
}})

// server handler
const { serverHandler } = require('./serverHandler')

// Initialize the http server
const httpServer = http.createServer(function(req, res) {
    serverHandler(req, res);
});

const HTTP_PORT = config.httpPort;

// Start http server
httpServer.listen(HTTP_PORT, function(){
    console.log(`Server listening on port ${HTTP_PORT} on ${config.envName} mode`);
});


// Initialize the https server
const httpServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpServerOptions,function(req, res) {
    serverHandler(req, res);
});

const HTTPS_PORT = config.httpsPort;

// Start https server
httpsServer.listen(HTTPS_PORT, function(){
    console.log(`Server listening on port ${HTTPS_PORT} on ${config.envName} mode`);
});
