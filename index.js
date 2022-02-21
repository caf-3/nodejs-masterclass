// built-in dependencies
const http = require('http');
const https = require('https')
const config = require('./config')
const fs = require('fs');
const _data = require('./lib/data');

// TESTING
// @TODO delete this

_data.create({dir: 'test', file: 'newFile', data: { role: 'NodeJs developer' }, callback: function(error){
    console.log('This was the error:\n'+error)
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
