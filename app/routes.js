var config = require('config'),
    questionControleur = require('./controleur/questionControleur');
    logger = config.logger;

module.exports = function (app) {

    app.get('/', function (req, res) {
        logger.log('debug', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.render('index.html');
    });
    app.post('/questions', questionControleur.créer);
    app.use(function (req, res) {
        logger.log('warn', '404 : impossible de trouver %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.status(404).render("404.html");
    });
};
