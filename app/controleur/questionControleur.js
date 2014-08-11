var RègleQuestionValide = require('../modeles/regles/question').ChampsValides,
    RègleOpinionValide = require('../modeles/regles/opinion').ChampsValides,
    Question = require('../modeles/Question'),
    Validateur = require('../modeles/regles/validateur'),
    QuestionModel = require('../infrastructure/questionSchema'),
    config = require('config'),
    logger = config.logger,
    mongoose = require('mongoose');

mongoose.connect(config.db);

exports.créerQuestion = function (req, res) {
    var question = req.body;
    var règles = [new RègleQuestionValide()];
    var questionValidateur = new Validateur(question, règles);
    if (questionValidateur.estValide()) {
        QuestionModel(question).save(function (err, question) {
            res.setHeader('Location', '/questions/' + question.id);
            res.status(201).send(null);
        });
    } else {
        res.status(400).send(questionValidateur.erreurs);
    }
};

exports.récupérerQuestion = function (req, res) {
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


exports.créerOpinion = function (req, res) {
    var opinion = req.body;
    var règles = [new RègleOpinionValide()];
    var validateur = new Validateur(opinion, règles);
    if (validateur.estValide()) {
        var idQuestion = req.params.id;
        QuestionModel.findByIdAndUpdate(idQuestion, {$push: {"opinions": opinion}}, {safe: true, upsert: true}, function (err) {
                if (err) {
                    res.status(404).end();
                }
                res.setHeader('Location', '/questions/' + idQuestion);
                res.status(201).send(null);
            }
        );
    } else {
        res.status(400).send(validateur.erreurs);
    }
};