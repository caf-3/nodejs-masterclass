const crypto = require('crypto')
const ENV = require('../config')

/**
 * Helper for varius tasks
 * @param {String} str 
 */
module.exports.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0){
        const hash = crypto.createHmac('sha256', ENV.hashingSecret).update(str).digest('base64url')
        return hash
    }else{
        return false
    }
}

/**
 * Helper for varius tasks
 * @param {String} str 
 */

module.exports.parseJsonToObject = (str) => {
    if(typeof(str) == 'string' && str.length > 0){
        const hash = crypto.createHmac('sha256', ENV.hashingSecret).update(str).digest('base64url')
        return hash
    }else{
        return false
    }
}