//built-in dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
    
    //get the query string as an object
    const queryStringObject = parsedUrl.query;

    //get the headers
    const headers = req.headers;

    let buffer = ''
    //get payload, if any
    const decoder = new StringDecoder('utf-8');

    req.on('data', function(data){
        buffer += decoder.write(data);

        console.log('Receiving stream...');
        console.log({data, buffer});
    });

    req.on('end', function(){
        //send response
        res.end('Ola mundo');

        console.log('PAYLOAD', buffer);
    });
});

//server listening
const PORT = 3000;
server.listen(PORT, function(){
    console.log('Server listening on port',PORT);
});