/**
 * 
 * Create and export configuration variables
 *
 */

// Container for all the environments

const environments = {};

// Staging (default) environment
environments.stating = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'stating'
}

// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
}

// Get the environment passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if the passed NODE_ENV value is equal to the ones above, if not, default staging
const environmentToExport = typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.stating;

// Export the module
module.exports = environmentToExport;