var express = require('express'),
    bodyParser = require('body-parser'),
    htmlEngine = require('swig'),
    logger = require('logger.js');

var app = express();

app.set('views', __dirname + '/app/vues');

app.engine('html', htmlEngine.renderFile);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

var port = process.env.PORT || 3000;

app.listen(port);

logger.log('info', 'Application vote de valeur fonctionne sur le port ' + port);
logger.debug('D');
logger.info('I');

exports = module.exports = app;