var Question = require('../app/modele/Question'),
    assert = require("assert");

describe('une question', function(){
    it('doit avoir un intitulé, des choix et des opinions', function(){
        var intitulé = 'Simple Question';
        var choix = ['choix 1', 'choix 2'];
        var question = new Question({intitulé: intitulé, choix: choix});
        assert.equal(question.intitulé, intitulé);
        assert.deepEqual(question.choix, choix);
        assert.deepEqual(question.opinions, []);
    });
});
