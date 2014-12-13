var winston = require('winston'),
    mkdirp = require('mkdirp'),
    config = require('config');

var logDir = __dirname + '/../log/';
mkdirp(logDir, function (err) {
    if (err) {
        console.error(err);
    }
});

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({level: config.loggingLevel,colorize: 'true'}),
        new (winston.transports.File)({
            filename: logDir + 'votedevaleur.log',
            maxsize: 10485760,
            maxFiles: 5,
            json: false,
            level: config.loggingLevel
        })
    ]
});

module.exports = logger;