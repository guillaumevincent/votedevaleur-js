var mongoose = require('mongoose'),
    config = require('config'),
    dépotVote = require('../../app/infrastructure/DépotVote'),
    assert = require('chai').assert;

describe("[Test d'integration] Dépot ", function () {

    before(function (done) {
        mongoose.connect(config.databaseUrl, function () {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        })
    });

    describe("d'un vote", function () {

        var vote;

        beforeEach(function () {
            vote = {
                intitulé: 'Nouveau vote',
                opinions: [
                    {
                        electeur: 'George',
                        notes: [
                            {choix: 'Choix 1', valeur: 2}
                        ]
                    }
                ],
                choix: ['Choix 1']
            };
        });

        it("doit avoir une fonction sauvegarde qui persiste l'object dans mongodb", function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                nouveauVote = nouveauVote.toJSON();
                assert.ok(nouveauVote.opinions instanceof Array);
                assert.ok(nouveauVote.choix instanceof Array);
                assert.ok(nouveauVote.idRaccourci.length > 8);
                assert.equal(nouveauVote.intitulé, 'Nouveau vote');
                assert.equal(nouveauVote.opinions[0].electeur, 'George');
                assert.deepEqual(nouveauVote.opinions[0].notes, [
                    {choix: 'Choix 1', valeur: 2}
                ]);
                done();
            });
        });

        it("doit avoir une fonction récupéreAvecId récupère l'object", function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                dépotVote.récupéreAvecId(nouveauVote.id, function (voteRécupéré) {
                    assert.equal(voteRécupéré.intitulé, vote.intitulé);
                    done();
                });
            });
        });

        it("doit avoir une fonction récupéreAvecId récupère l'object", function (done) {
            dépotVote.récupére({intitulé: 'Nouveau vote'}, function (voteRécupéré) {
                assert.deepEqual(voteRécupéré.intitulé, vote.intitulé);
                done();
            });
        });

        it("doit avoir une fonction mettreAJour qui met à jour l'object", function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                dépotVote.mettreAJour(nouveauVote.id, {intitulé: 'Titre modifié'}, function (voteMisAJour) {
                    assert.equal(voteMisAJour.intitulé, 'Titre modifié');
                    done();
                });
            });
        });

        it('ne doit pas contenir de champ __v et _id dans sa méthode toJSON', function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                var jsonVote = nouveauVote.toJSON();
                assert.ok('id' in jsonVote);
                assert.ok('id' in jsonVote.opinions[0]);
                assert.notOk('_id' in jsonVote);
                assert.notOk('__v' in jsonVote);
                assert.notOk('_id' in jsonVote.opinions[0]);
                assert.notOk('_id' in jsonVote.opinions[0].notes[0]);
                done();
            });
        });

        it("doit avoir une fonction ajouterOpinion qui ajoute une opinion", function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                var opinion = {};
                dépotVote.ajouterOpinion(nouveauVote._id, opinion, function (voteMisAJour, err) {
                    assert.equal(voteMisAJour.opinions.length, 2);
                    done();
                });
            });
        });


        it("doit avoir une fonction supprimerOpinion qui supprime une opinion", function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                dépotVote.supprimerOpinion(nouveauVote._id, nouveauVote.opinions[0].id, function (voteMisAJour, err) {
                    assert.equal(voteMisAJour.opinions.length, 0);
                    done();
                });
            });
        });

        it('doit avoir une méthode toJSON qui ajouter des informations passées en paramètre', function (done) {
            dépotVote.sauvegarde(vote, function (nouveauVote) {
                assert.deepEqual(nouveauVote.toJSON({réponses: ["Choix 1"]}).réponses, ["Choix 1"]);
                done();
            });
        });
    });
});




