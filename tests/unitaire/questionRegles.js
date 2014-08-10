var ChampsValides = require('../../app/modeles/regles/question').ChampsValides,
    assert = require('assert');

describe('règles sur une question', function () {
    var règle;

    beforeEach(function () {
        règle = new ChampsValides();
    });

    it('est respectée si une question a au moins 2 choix et posséde un intulé', function () {
        assert.ok(règle.estRespectée({"intitulé": "Nouvelle question", "choix": ["Choix 1", "Choix 2"]}));
    });

    it("n'est pas respectée si une question n'a pas d'intitulé", function () {
        assert.equal(règle.estRespectée({"intitulé": "", "choix": ["Choix 1", "Choix 2"]}), false);
        assert.deepEqual(règle.erreurs[0].code, 1000);
        assert.deepEqual(règle.erreurs[0].message, "une question doit contenir un intitulé");
    });

    it("n'est pas respectée si une question n'a pas au moins 2 choix", function () {
        assert.equal(règle.estRespectée({"intitulé": "Nouvelle question", "choix": []}), false);
        assert.deepEqual(règle.erreurs[0].code, 1001);
        assert.deepEqual(règle.erreurs[0].message, "une question doit contenir au moins 2 choix");
    });

    it("n'est pas respectée si une question n'a pas 2 choix et un intitulé", function () {
        assert.equal(règle.estRespectée({"intitulé": "", "choix": []}), false);
        assert.deepEqual(règle.erreurs[0].code, 1000);
        assert.deepEqual(règle.erreurs[1].code, 1001);
    });

    it("n'est pas respectée si d'autres champs sont présents", function () {
        assert.equal(règle.estRespectée({"hacker": ""}), false);
        assert.deepEqual(règle.erreurs[0].code, 1002);
        assert.deepEqual(règle.erreurs[0].message, "object question invalide");
    });

    it("n'est pas respectée si la question est vide", function () {
        assert.equal(règle.estRespectée({}), false);
        assert.deepEqual(règle.erreurs[0].code, 1002);
        assert.deepEqual(règle.erreurs[0].message, "object question invalide");
    });
});