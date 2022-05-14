const StringDecoder = require('string_decoder').StringDecoder;
const url = require('url');
const _data = require('./lib/data')
const helpers = require('./lib/helpers')

// Define route handlers
const handlers = {};

/**
 * Ping handler
 * cb stands for callback
 */
 handlers.ping = function(data, cb){
    // Callback a http statusCode and the payload object
    cb(200)
}
//  For not defined handlers
handlers.notFound = function(data, cb){
    cb(404, {message: `Cannot find /${data.path}`})
}

// Users handler
handlers.users = function(data, cb){

    const allowedMethods = ['get', 'put', 'post', 'delete']
    if(allowedMethods.includes(data.method)){
        handlers._users[data.method](data, cb)
    }else{
        cb(405)
    }
}

// users controllers

// get users
handlers._users.get = function(data, callback){}

// post users
/**
 * Create user
 * @param {{payload : { firstName, lastName, phone, password, tosAgreement } }} data 
 * @param {Function} cb Callback function 
 */
handlers._users.post = function(data, cb){
    
    const payload = {
        firstName: data?.payload?.firstName,
        lastName: data?.payload?.lastName,
        phone: data?.payload?.phone,
        password: data?.payload?.password,
        tosAgreement: data?.payload?.tosAgreement
    }

    let { firstName, lastName, phone, password, tosAgreement } = payload

    firstName = typeof(firstName) == 'string' && firstName.trim().length > 0 ? firstName : false
    lastName = typeof(lastName) == 'string' && lastName.trim().length > 0 ? lastName : false
    phone = typeof(phone) == 'string' && phone.trim().length == 9 ? phone : false
    password = typeof(password) == 'string' && password.trim().length > 0 ? password : false
    tosAgreement = typeof(tosAgreement) == 'boolean' && tosAgreement == true ? tosAgreement : false

    if(firstName && lastName && phone && password && tosAgreement){
        _data.read({dir: 'users', file: phone, callback: function(err, data){
            if(err){
                // Hash the password
                const hashedPassword = helpers.hash(password)
                if(!hashedPassword) return cb(500, { Error: err})
                const userObj = {
                    firstName,
                    lastName,
                    phone,
                    hashedPassword,
                    tosAgreement
                }

                _data.create({dir: 'users', file: phone, data: userObj, callback: function(err){
                    if(err){
                        console.log({err})
                        cb(500, { Error: 'Could not create the new user'})
                    }else{
                        cb(200)
                    }
                }})

            }else{
                cb(400, { Error: 'A user with that phone number already exists!' })
            }
        }})
    }else{
        cb(409, {'Error': 'Missing required fields'})

    }

}

// put users
handlers._users.put = function(data, callback){}

// delete users
handlers._users.delete = function(data, callback){}


// Define a request router 
const router = {ping: handlers.ping}

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

            console.log({ data, statusCode })
        })
    });
}
