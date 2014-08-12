var config = require('config'),
    voteControleur = require('./controleur/voteControleur');
    logger = config.logger;

module.exports = function (app) {
    app.get('/', function (req, res) {
        logger.log('debug', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.render('vote.html');
    });
    app.post('/votes', voteControleur.créerUnVote);
    app.get('/votes/:id', voteControleur.récupérerUnVote);
    app.get('/votes/:id/opinions/', function (req, res) {
        logger.log('debug', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.render('opinion.html');
    });
    app.post('/votes/:id/opinions', voteControleur.créerOpinion);
    app.get('/:id', voteControleur.raccourciDUnVote);

    app.use(function (req, res) {
        logger.log('warn', '404 : impossible de trouver %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.status(404).render("404.html");
    });
};
