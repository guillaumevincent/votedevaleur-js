var express = require('express'),
    bodyParser = require('body-parser'),
    htmlEngine = require('swig'),
    logger = require('logger.js'),
    dossierPublic = __dirname + '/public',
    app = express();

app.set('views', dossierPublic);

app.engine('html', htmlEngine.renderFile);

app.use(bodyParser.json());

app.use(express.static(dossierPublic));

require('./app/routes')(app);

var port = process.env.PORT || 3000;

app.listen(port);

logger.log('info', 'Application vote de valeur fonctionne sur le port ' + port);

exports = module.exports = app;