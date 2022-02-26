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

// Update data inside the file
lib.update = function({dir, file, data, callback }){
    
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){

        if(!err && fileDescriptor){

            // Convert data to string
            const stringData = JSON.stringify(data);

            // Truncate file
            fs.ftruncate(fileDescriptor, function(err){

                if(err){
                    callback('Error truncating file', err);
                }else{
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err){

                        if(err) {
                            callback('Error writing existing file', err);
                        }else{
                        
                            fs.close(fileDescriptor, function(err){
                                if(err) {
                                    callback('Error closing existing file', err);
                                }else{
                                    callback(false);
                                }
                            })
                        
                        }
                    })
                }
            })
        }else{
            callback('Error opening file', err)
        }

    })

}

// Delete a file from file sytem
lib.delete = function({dir, file, callback}){

    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        
        if(err) {
            callback('There was an err deleting the file')
        }else{
            callback(false)
        }
    })
}

module.exports = lib