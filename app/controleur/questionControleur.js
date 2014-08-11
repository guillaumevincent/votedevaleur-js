var ChampsValides = require('../modeles/regles/question').ChampsValides,
    Question = require('../modeles/Question').Question,
    QuestionValidateur = require('../modeles/Question').Validateur,
    QuestionModel = require('../infrastructure/questionSchema'),
    config = require('config'),
    logger = config.logger,
    mongoose = require('mongoose');

mongoose.connect(config.db);

exports.créer = function (req, res) {
    var question = req.body;
    var règles = [new ChampsValides()];
    var questionValidateur = new QuestionValidateur(question, règles);
    if (questionValidateur.estValide()) {
        QuestionModel(question).save(function (err, question) {
            res.setHeader('Location', '/questions/' + question.id);
            res.status(201).send(null);
        });
    } else {
        res.status(400).send(questionValidateur.erreurs);
    }
};

exports.récupérer = function (req, res) {
    QuestionModel.findById(req.params.id, function (err, question) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.status(404).end();
        } else {
            var réponses = new Question(question).obtenirUneRéponse();
            res.status(200).end(JSON.stringify(question.toJSON({réponses: réponses})));
        }
    });
};