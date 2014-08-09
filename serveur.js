var express = require('express'),
    bodyParser = require('body-parser'),
    htmlEngine = require('swig'),
    config = require('config');

var app = express();

app.set('views', __dirname + '/app/vues');

app.engine('html', htmlEngine.renderFile);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

var port = process.env.PORT || 3000;

app.listen(port);

console.log('Application vote de valeur fonctionne sur le port ' + port + ' (environnement: ' + config.environment + ')');

exports = module.exports = app;
