var mongoose = require('mongoose'),
    config = require('config'),
    dépotVote = require('../../app/infrastructure/DépotVote'),
    assert = require('assert');

describe("[Test d'integration] Dépot ", function () {

    before(function (done) {
        mongoose.connect(config.db, function () {
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
                assert.equal('_id' in jsonVote, false);
                assert.equal('__v' in jsonVote, false);
                assert.equal('_id' in jsonVote.opinions[0], false);
                assert.equal('_id' in jsonVote.opinions[0].notes[0], false);
                done();
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




