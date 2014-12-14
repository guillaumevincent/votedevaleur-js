var logger = require('logger'),
    voteControleur = require('./controleur/voteControleur');

module.exports = function (app) {
    app.use(function (req, res) {
        logger.log('debug', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.sendfile(dossierPublic + '/index.html');
    });
    app.post('/votes', voteControleur.créerUnVote);
    app.get('/votes/:id', voteControleur.récupérerUnVote);
    app.post('/votes/:id/opinions', voteControleur.créerOpinion);
    app.get('/:id', voteControleur.raccourciDUnVote);
};
