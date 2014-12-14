var logger = require('logger'),
    voteControleur = require('./controleur/voteControleur'),
    path = require('path');

module.exports = function (app) {
    app.post('/votes', voteControleur.créerUnVote);
    app.get('/votes/:id', voteControleur.récupérerUnVote);
    app.post('/votes/:id/opinions', voteControleur.créerOpinion);
    app.get('/:id', voteControleur.raccourciDUnVote);
    app.get('*', function (req, res) {
        logger.log('info', 'GET %s pour %s (User Agent: %s)', req.path, req.connection.remoteAddress, req.headers['user-agent']);
        res.sendFile('index.html', {root: path.join(__dirname, '../public')});
    });
};
