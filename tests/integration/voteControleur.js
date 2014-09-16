var request = require('supertest'),
    config = require('config'),
    mongoose = require('mongoose'),
    app = require('../../serveur'),
    DépotVote = require('../../app/infrastructure/DépotVote'),
    assert = require('assert');

describe('[API] controleur de vote', function () {

    before(function (done) {
        mongoose.connect(config.db, function () {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        })
    });

    describe('POST /vote', function () {
        it("respond avec 400 Bad Request si la vote passée dans le corps de la réquète n'est pas bon", function (done) {
            var errors = [
                {"code": 1002, "message": "object vote invalide"}
            ];
            request(app)
                .post('/votes')
                .send({})
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(400, errors, done);
        });

        it('respond avec un 201 Created ainsi que le champ Location dans les headers', function (done) {
            var choix = ['Choix 1', 'Choix 2'];
            request(app)
                .post('/votes')
                .send({intitulé: 'Nouveau vote', choix: choix})
                .expect(201, {})
                .end(function (err, res) {
                    var idVote = res.headers['location'].slice(7);

                    DépotVote.récupéreAvecId(idVote, function (vote, erreurs) {
                        vote = vote.toJSON();
                        assert.deepEqual(vote.choix, choix);
                        done();
                    });
                });
        });
    });

    describe('GET /votes/:id', function () {
        it('répond 200 ok', function (done) {
            DépotVote.sauvegarde({intitulé: 'Nouveau vote', opinions: [], choix: []}, function (nouveauVote, erreurs) {
                request(app)
                    .get('/votes/' + nouveauVote._id)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200, function (err, res) {
                        assert.deepEqual(res.body.réponses, []);
                        done();
                    });
            });
        });

        it("doit retourner erreur 404 si la vote n'existe pas", function (done) {
            request(app)
                .get('/votes/IdQuiNExistePas')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(404, done);
        });
    });

    describe('POST /votes/:id/opinions', function () {
        var vote;

        beforeEach(function () {
            vote = {intitulé: 'Nouveau vote', opinions: [], choix: []};
        });

        it("respond avec 400 Bad Request si l'opinion passée dans le corps de la réquète n'est pas bon", function (done) {
            DépotVote.sauvegarde(vote, function (nouveauVote, erreurs) {
                request(app)
                    .post('/votes/' + nouveauVote._id + '/opinions')
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
            DépotVote.sauvegarde(vote, function (nouveauVote, erreurs) {
                request(app)
                    .post('/votes/' + nouveauVote._id + '/opinions')
                    .send({notes: notes, 'electeur': 'Guillaume'})
                    .expect(201, {})
                    .end(function () {
                        DépotVote.récupéreAvecId(nouveauVote._id, function (voteRécupéré, err) {
                            voteRécupéré = voteRécupéré.toJSON();
                            assert.deepEqual(voteRécupéré.opinions[0].notes, notes);
                            assert.deepEqual(voteRécupéré.opinions[0].electeur, 'Guillaume');
                            done();
                        });
                    });
            });
        });
    });

    describe("GET raccourcisseur d'URL", function () {
        it("redirige vers l'url dédission", function (done) {
            DépotVote.sauvegarde({intitulé: 'Nouveau vote', opinions: [], choix: []}, function (nouveauVote, erreurs) {
                request(app)
                    .get('/' + nouveauVote.idRaccourci)
                    .expect(302, function (err, res) {
                        assert.equal(res.header.location, '/votes/' + nouveauVote._id + '/opinions');
                        done();
                    });
            });
        });
    });
});