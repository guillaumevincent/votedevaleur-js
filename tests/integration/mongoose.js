var mongoose = require('mongoose'),
    config = require('config'),
    Question = require('../../app/modeles/questionSchema'),
    assert = require('assert');

describe("[Test d'integration] Mongoose", function () {

    before(function (done) {
        mongoose.connect(config.db, function () {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        })
    });

    describe("schema d'une question", function () {
        var question;

        beforeEach(function () {
            question = new Question({
                intitulé: 'Nouvelle question',
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
            assert.equal('_id' in question.toJSON(), false);
            assert.equal('__v' in question.toJSON(), false);
            assert.equal('_id' in question.toJSON().opinions[0], false);
            assert.equal('_id' in question.toJSON().opinions[0].notes[0], false);
        });

        it("doit avoir un intitulé, une liste d'opinions et une liste de choix", function (done) {
            question.save(function (err, questionSauvegardée) {
                questionSauvegardée = questionSauvegardée.toJSON();
                assert.ok(questionSauvegardée.opinions instanceof Array);
                assert.ok(questionSauvegardée.choix instanceof Array);
                assert.equal(questionSauvegardée.intitulé, 'Nouvelle question');
                assert.equal(questionSauvegardée.opinions[0].electeur, 'George');
                assert.deepEqual(questionSauvegardée.opinions[0].notes, [
                    {choix: 'Choix 1', valeur: 2}
                ]);
                done();
            });
        });
    });
});




