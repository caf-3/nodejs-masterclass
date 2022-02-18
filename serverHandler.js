const StringDecoder = require('string_decoder').StringDecoder;
const url = require('url');

// Define route handlers
const handlers = {};

/**
 * Sample handler
 * cb stands for callback
 */
 handlers.sample = function(data, cb){
    // Callback a http statusCode and the payload object
    cb(401, {message: "You reached the sample route handler"})
}
//  For not defined handlers
handlers.notFound = function(data, cb){
    cb(404, {message: `Cannot find /${data.path}`})
}

// Define a request router 
const router = {sample: handlers.sample}

module.exports.serverHandler = (req, res) => {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path
    const _path = parsedUrl.pathname;

    // get the method
    const method = req.method.toUpperCase();

    // remove forward slashes from all sides (not removing those in the middle)
    const path = _path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    const queryStringObject = parsedUrl.query;

    // get the headers
    const headers = req.headers;

    let buffer = ''
    // get payload, if any
    const decoder = new StringDecoder('utf-8');

    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {

        // Choose the handler this request should go to, if this route is not defined we shoud got the not found handler
        const chosenHandler = router.hasOwnProperty(path) ? router[path] : handlers.notFound;

        // The data object to send to the handler to send to the handler
        const data = {
            path: path,
            query: queryStringObject,
            method: method,
            headers, headers,
            payload: buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            // Use status code sent by the handler or use 200 as default
            statusCode = typeof (statusCode) == 'number' || String(statusCode).length == 3 ? statusCode : 200;

            // If the payload sent by the handler is not and object, we send an empty object
            payload = typeof (payload) == "object" ? payload : {}
            payload = JSON.stringify(payload)

            // Set the response Content-Type
            res.setHeader("Content-Type", "application/json");

            // HTTP status code
            res.writeHead(statusCode);

            // The response
            res.end(payload);

            console.log({ data })
        })
    });
}
