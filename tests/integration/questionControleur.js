var request = require('supertest'),
    config = require('config'),
    mongoose = require('mongoose'),
    app = require('../../serveur'),
    Question = require('../../app/infrastructure/questionSchema'),
    assert = require('assert');

describe('[API] controleur de question', function () {

    before(function (done) {
        mongoose.connect(config.db, function () {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        })
    });

    describe('POST /question', function () {
        it("respond avec 400 Bad Request si la question passée dans le corps de la réquète n'est pas bon", function (done) {
            var errors = [
                {"code": 1002, "message": "object question invalide"}
            ];
            request(app)
                .post('/questions')
                .send({})
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(400, errors, done);
        });

        it('respond avec un 201 Created ainsi que le champ Location dans les headers', function (done) {
            var choix = ['Choix 1', 'Choix 2'];
            request(app)
                .post('/questions')
                .send({intitulé: 'Nouvelle question', choix: choix})
                .expect(201, {})
                .end(function (err, res) {
                    var idQuestion = res.headers['location'].slice(11);
                    Question.findById(idQuestion, function (err, question) {
                        question = question.toJSON();
                        assert.deepEqual(question.choix, choix);
                        done();
                    });
                });
        });
    });

    describe('GET /questions/:id', function () {
        it('répond 200 ok', function (done) {
            var question = new Question({intitulé: 'Nouvelle question', opinions: [], choix: []});
            question.save(function (err, questionSauvegardée) {
                request(app)
                    .get('/questions/' + questionSauvegardée._id)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200, function (err, res) {
                        assert.deepEqual(res.body.réponses, []);
                        done();
                    });
            });
        });

        it("doit retourner erreur 404 si la question n'est pas trouvée", function (done) {
            request(app)
                .get('/questions/IdDidntMatch')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(404, done);
        });
    });

    describe('POST /questions/:id/opinions', function () {
        var question;
        beforeEach(function () {
            question = new Question({intitulé: 'Nouvelle question', opinions: [], choix: []});
        });
        it("respond avec 400 Bad Request si l'opinion passée dans le corps de la réquète n'est pas bon", function (done) {
            question.save(function (err, questionSauvegardée) {
                request(app)
                    .post('/questions/' + questionSauvegardée._id + '/opinions')
                    .send({})
                    .expect('Content-Type', /json/)
                    .expect(400, done);
            });
        });

        it('répond 201 Created', function (done) {
            var notes = [
                {choix: 'Choix 1', valeur: 1},
                {choix: 'Choix 2', valeur: 2}
            ];
            question.save(function (err, questionSauvegardée) {
                request(app)
                    .post('/questions/' + questionSauvegardée._id + '/opinions')
                    .send({notes: notes, 'electeur': 'Guillaume'})
                    .expect(201, {})
                    .end(function () {
                        Question.findById(questionSauvegardée._id, function (err, nouvelleQuestion) {
                            nouvelleQuestion = nouvelleQuestion.toJSON();
                            assert.deepEqual(nouvelleQuestion.opinions[0].notes, notes);
                            assert.deepEqual(nouvelleQuestion.opinions[0].electeur, 'Guillaume');
                            done();
                        });
                    });
            });
        });
    });

    describe("GET raccourcisseur d'URL", function () {
        it("redirige vers l'url dédission", function (done) {
            var question = new Question({intitulé: 'Nouvelle question', opinions: [], choix: []});
            question.save(function (err, questionSauvegardée) {
                request(app)
                    .get('/' + questionSauvegardée.idRaccourci)
                    .expect(302, function (err, res) {
                        assert.equal(res.header.location, '/questions/'+questionSauvegardée._id+'/opinions');
                        done();
                    });
            });
        });
    });
});