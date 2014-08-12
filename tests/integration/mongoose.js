var mongoose = require('mongoose'),
    config = require('config'),
    Vote = require('../../app/infrastructure/voteSchema'),
    assert = require('assert');

describe("[Test d'integration] Mongoose", function () {

    before(function (done) {
        mongoose.connect(config.db, function () {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        })
    });

    describe("schema d'une vote", function () {
        var vote;

        beforeEach(function () {
            vote = new Vote({
                intitulé: 'Nouvelle vote',
                opinions: [
                    {
                        electeur: 'George',
                        notes: [
                            {choix: 'Choix 1', valeur: 2}
                        ]
                    }
                ],
                choix: ['Choix 1']});
        });

        it('ne doit pas contenir de champ __v et _id dans sa méthode toJSON', function () {
            assert.equal('_id' in vote.toJSON(), false);
            assert.equal('__v' in vote.toJSON(), false);
            assert.equal('_id' in vote.toJSON().opinions[0], false);
            assert.equal('_id' in vote.toJSON().opinions[0].notes[0], false);
        });

        it("doit avoir un intitulé, une liste d'opinions et une liste de choix", function (done) {
            vote.save(function (err, nouveauVote) {
                nouveauVote = nouveauVote.toJSON();
                assert.ok(nouveauVote.opinions instanceof Array);
                assert.ok(nouveauVote.choix instanceof Array);
                assert.ok(nouveauVote.idRaccourci.length > 8);
                assert.equal(nouveauVote.intitulé, 'Nouvelle vote');
                assert.equal(nouveauVote.opinions[0].electeur, 'George');
                assert.deepEqual(nouveauVote.opinions[0].notes, [
                    {choix: 'Choix 1', valeur: 2}
                ]);
                done();
            });
        });

        it('doit avoir une méthode toJSON qui ajouter des informations passées en paramètre', function () {
            assert.deepEqual(vote.toJSON({réponses: ["Choix 1"]}).réponses, ["Choix 1"]);
        });

    });
});




