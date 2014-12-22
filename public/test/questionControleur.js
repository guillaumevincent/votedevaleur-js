var assert = chai.assert;

describe('Controleur de question', function () {

    beforeEach(module('votedevaleur'));

    var scope, http, controleur, location;

    beforeEach(inject(function ($rootScope, $httpBackend, $controller) {
        scope = $rootScope.$new();
        http = $httpBackend;
        controleur = $controller('questionControleur', {$scope: scope});
    }));

    it('Quand le scope est chargé il y a un intitulé et des choix', function () {
        assert.equal(scope.intitule, '');
        assert.deepEqual(scope.choix, []);
    });

    it('une question est valide si il y a au moins un intitulé et 2 choix', function () {
        assert.equal(scope.estValide, false);
        scope.$apply(function () {
            scope.intitule = 'Nouvelle question';
            scope.choix = [{valeur: 'Choix 1'}, {valeur: 'Choix 2'}];
        });
        assert.ok(scope.estValide);
    });

    it('peut ajouter un choix', function () {
        scope.ajouterUnChoix('Choix 1');
        assert.deepEqual(scope.choix, [{valeur: 'Choix 1'}]);
    });

    it('ne peut pas ajouter le même choix deux fois', function () {
        scope.ajouterUnChoix('Choix 1');
        assert.deepEqual(scope.choix, [{valeur: 'Choix 1'}]);
        scope.ajouterUnChoix('Choix 1');
        assert.deepEqual(scope.choix, [{valeur: 'Choix 1'}]);
        assert.equal(scope.messageDErreur, "Il n'est pas possible d'ajouter deux fois le même choix");
    });

    it('ne peut pas ajouter un choix vide', function () {
        scope.ajouterUnChoix('');
        assert.deepEqual(scope.choix, []);
        assert.equal(scope.messageDErreur, "Vous ne pouvez pas ajouter un choix vide");
    });

    it('peut supprimer un choix', function () {
        var premierChoix = {valeur: 'Choix 1'};
        scope.choix = [premierChoix, {valeur: 'Choix 2'}];
        scope.supprimerChoix(premierChoix);
        assert.deepEqual(scope.choix, [{valeur: 'Choix 2'}]);
    });

    it("ajouter un choix valide supprime le message d'erreur et vide le nouveau choix", function () {
        scope.messageDErreur = "Vous ne pouvez pas ajouter un choix vide";
        scope.nouveauChoix = "Choix Valide";
        scope.ajouterUnChoix(scope.nouveauChoix);
        assert.equal(scope.messageDErreur, '');
        assert.equal(scope.nouveauChoix, '');
    });

    it("peut supprimer dernier choix", function () {
        scope.choix = [{valeur: 'Choix 1'}, {valeur: 'Choix 2'}];
        scope.supprimerDernierChoix();
        assert.deepEqual(scope.choix, [{valeur: 'Choix 1'}]);
    });

    it("peut créer une question", function () {
        var intitulé = 'question test';
        http.expect('POST', '/votes/', {intitulé: intitulé, choix: ['a', 'b']}).respond(200);
        scope.$apply(function () {
            scope.intitule = intitulé;
            scope.choix = [{valeur: 'a'}, {valeur: 'b'}];
        });
        scope.creerUnVote();
        assert.isUndefined(scope.messageDErreur);
        http.flush();
    });
});