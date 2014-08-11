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
                .expect('Content-Type', /json/)
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
                    .expect('Content-Type', 'application/json')
                    .expect(200, function (err, res) {
                        assert.deepEqual(res.body.réponses, []);
                        done();
                    });
            });
        });

        it("doit retourner erreur 404 si la question n'est pas trouvée", function (done) {
            request(app)
                .get('/questions/IdDidntMatch')
                .expect('Content-Type', 'application/json')
                .expect(404, done);
        });
    });

});