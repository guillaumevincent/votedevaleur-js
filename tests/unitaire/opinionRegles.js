var ChampsValides = require('../../app/modeles/regles/opinion').ChampsValides,
    assert = require('assert');

describe('règles sur une question', function () {
    var règle, opinion;

    beforeEach(function () {
        règle = new ChampsValides();
        opinion = {
            electeur: 'Guillaume Vincent',
            notes: [
                {choix: 'Choix 1', valeur: 2},
                {choix: 'Choix 2', valeur: -1}
            ]
        }
    });

    it('est respectée si une opinion a un electeur et des notes', function () {
        assert.ok(règle.estRespectée(opinion));
    });

    it("n'est pas respecté si on ajoute une opinion vide", function () {
        assert.equal(règle.estRespectée({}), false);
    });

    it("n'est pas respectée si d'autres champs sont présents", function () {
        assert.equal(règle.estRespectée({"hacker": ""}), false);
        assert.deepEqual(règle.erreurs[0].code, 1002);
        assert.deepEqual(règle.erreurs[0].message, "object question invalide");
    });

    it("n'est pas respectée si d'autres champs sont présents dans notes", function () {
        assert.equal(règle.estRespectée({"electeur": "Guillaume", notes: [
            {'hackers': ''}
        ]}), false);
        assert.deepEqual(règle.erreurs[0].code, 1002);
        assert.deepEqual(règle.erreurs[0].message, "object question invalide");
    });

    it("n'est pas respectée si une question n'a pas d'electeur", function () {
        assert.equal(règle.estRespectée({"electeur": "", "notes": []}), false);
        assert.deepEqual(règle.erreurs[0].code, 2000);
        assert.deepEqual(règle.erreurs[0].message, "une opinion doit être portée par un electeur");
    });

    it("une note a une valeur comprise entre 2 et -2", function () {
        assert.equal(règle.estRespectée({"electeur": "Guillaume", "notes": [
            {choix: 'Choix 2', valeur: -4}
        ]}), false);
        assert.deepEqual(règle.erreurs[0].code, 2001);
        assert.deepEqual(règle.erreurs[0].message, "le valeur d'un choix doit être compris entre -2 et 2");
    });

    it("une note a une valeur comprise entre 2 et -2 et une valeur invalide", function () {
        assert.equal(règle.estRespectée({"electeur": "Guillaume", "notes": [
            {choix: 'Choix 1', valeur: 2},
            {choix: 'Choix 2', valeur: 4}
        ]}), false);
        assert.deepEqual(règle.erreurs[0].code, 2001);
        assert.deepEqual(règle.erreurs[0].message, "le valeur d'un choix doit être compris entre -2 et 2");
    });
});