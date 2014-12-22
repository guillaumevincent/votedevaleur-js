var RègleVoteValide = require('../modeles/regles/vote').ChampsValides,
    RègleOpinionValide = require('../modeles/regles/opinion').ChampsValides,
    Vote = require('../modeles/vote'),
    Validateur = require('../modeles/regles/validateur'),
    dépotDeVote = require('../infrastructure/DépotVote'),
    logger = require('logger');

exports.créerUnVote = function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    var vote = req.body;
    var règles = [new RègleVoteValide()];
    var validateur = new Validateur(vote, règles);
    if (validateur.estValide()) {
        dépotDeVote.sauvegarde(vote, function (nouveauVote, erreurs) {
            res.setHeader('Location', '/votes/' + nouveauVote.id);
            res.status(201).send(null);
        });
    } else {
        res.status(400).send(validateur.erreurs);
    }
};

exports.récupérerUnVote = function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    dépotDeVote.récupéreAvecId(req.params.id, function (vote, erreurs) {
        if (vote) {
            var réponses = new Vote(vote).obtenirUneRéponse();
            res.status(200).end(JSON.stringify(vote.toJSON({réponses: réponses})));
        } else {
            res.status(404).end();
        }
    });
};

exports.ajouteUneOpinion = function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    var opinion = req.body;
    var règles = [new RègleOpinionValide()];
    var validateur = new Validateur(opinion, règles);
    if (validateur.estValide()) {
        var idVote = req.params.id;
        dépotDeVote.ajouterOpinion(idVote, opinion, function (vote, erreurs) {
            if (erreurs) {
                res.status(404).end();
            } else {
                res.setHeader('Location', '/votes/' + idVote);
                res.status(201).send(null);
            }
        });
    } else {
        res.status(400).send(validateur.erreurs);
    }
};

exports.supprimerOpinion = function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    var voteId = req.params.voteId;
    dépotDeVote.supprimerOpinion(voteId, req.params.opinionId, function (vote, erreurs) {
        if (erreurs) {
            res.status(404).end();
        } else {
            res.setHeader('Location', '/votes/' + voteId);
            res.status(200).send(null);
        }
    });
};

exports.raccourciDUnVote = function (req, res) {
    dépotDeVote.récupére({idRaccourci: req.params.id}, function (vote, erreurs) {
        if (vote) {
            res.redirect('/votes/' + vote._id + '/opinions');
        } else {
            res.status(404).render("404.html");
        }
    });
};