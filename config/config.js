var environment = process.env.NODE_ENV || 'development';

var config = require(environment);

config.environment = environment;

var winston = require('winston');

var transports = [];

var loggingLevel = config.loggingLevel || 'info';

if (environment === 'development') {
    var consoleTransport = new (winston.transports.Console)({colorize: 'true'});
    consoleTransport.level = loggingLevel;
    transports.push(consoleTransport);
} else {
    var fileTransport = new (winston.transports.File)({filename: 'log/' + 'votedevaleur.log', maxsize: 10485760, maxFiles: 5, json: false})
    fileTransport.level = loggingLevel;
    transports.push(fileTransport);
}

config.logger = new (winston.Logger)({transports: transports});

module.exports = config;