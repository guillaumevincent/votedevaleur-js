var config = require('config'),
    questionControleur = require('./controleur/questionControleur');
    logger = config.logger;

module.exports = function (app) {

    app.get('/', function (req, res) {
        logger.log('debug', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.render('question.html');
    });
    app.post('/questions', questionControleur.créer);
    app.get('/questions/:id/opinions/', function (req, res) {
        logger.log('debug', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.render('opinion.html');
    });

    app.use(function (req, res) {
        logger.log('warn', '404 : impossible de trouver %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.status(404).render("404.html");
    });
};
