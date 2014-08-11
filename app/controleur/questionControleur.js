var ChampsValides = require('../modeles/regles/question').ChampsValides,
    Question = require('../modeles/Question').Question,
    QuestionValidateur = require('../modeles/Question').Validateur,
    config = require('config'),
    logger = config.logger,
    QuestionModel = require('../modeles/questionSchema'),
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