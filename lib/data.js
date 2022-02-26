/**
 * LIbrary for storing and editing data
 * 
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module (to be exported)
const lib = {}

// Base directory for the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function ({ dir, file, data, callback }) {

    // The folder to store the file
    const destination = lib.baseDir+dir;

    // Creating the directory
    fs.mkdir(destination, err => {

        if (!err) {
            // Open the file for writing
            fs.open(lib.baseDir+dir+'/'+file + '.json', 'wx', function (err, fileDescriptor) {

                if (!err && fileDescriptor) {

                    // Convert data to string
                    const stringData = JSON.stringify(data);

                    // Write to file and close it
                    fs.writeFile(fileDescriptor, stringData, function (err) {

                        if (!err) {

                            // Closing the file
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback('There was error closing the file.\n' + err);
                                }
                            })

                        } else {
                            callback('There was an error writing to new file');
                        }
                    })
                } else {
                    callback('Could not create new file.\n' + err)
                }
            })
        } else {
            callback("Erro creating directory"+err)
        }
    })
}

// Read data from file
lib.read = function({dir, file, callback}) {
    
    const readFrom = lib.baseDir+dir;
    
    fs.readFile(readFrom+'/'+file+'.json', 'utf8', function(err, data){
        
        const error = err ? err : false;

        callback(error, data)
    })
}

module.exports = lib