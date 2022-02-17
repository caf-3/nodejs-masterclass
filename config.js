/**
 * 
 * Create and export configuration variables
 *
 */

// Container for all the environments

const environments = {};

// Staging (default) environment
environments.stating = {
    port: 3000,
    envName: 'stating'
}

// Production environment
environments.production = {
    port: 5000,
    envName: 'production'
}

// Get the environment passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if the passed NODE_ENV value is equal to the ones above, if not, default staging
const environmentToExport = typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.stating;

// Export the module
module.exports = environmentToExport;