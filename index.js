//built-in dependencies
const http = require('http');
const url = require('url');

//server responses for api calls
const server = http.createServer(function(req, res) {
    
    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    //get the path
    const path = parsedUrl.pathname;

    //get the method
    const method = req.method.toUpperCase();
    
    //remove forward slashes from all sides (not removing those in the middle)
    const trimedPath = path.replace(/^\/+|\/+$/g, '');
    
    //send response
    res.end('Ola mundo');

    //log the request path
    console.log(`HTTP ${method} REQUEST RECEIVED AT /${trimedPath}`);
});

//server listening
const PORT = 3000;
server.listen(PORT, function(){
    console.log('Server listening on port',PORT);
});