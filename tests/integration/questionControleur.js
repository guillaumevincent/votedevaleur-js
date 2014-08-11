var request = require('supertest'),
    config = require('config'),
    mongoose = require('mongoose'),
    app = require('../../serveur'),
    Question = require('../../app/modeles/questionSchema'),
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
                .send({intitulé: 'Nouvelle election', choix: choix})
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

});