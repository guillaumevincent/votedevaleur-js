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
            scope.choix = ['Choix 1', 'Choix 2'];
        });
        assert.ok(scope.estValide);
    });

    it('peut ajouter un choix', function () {
        scope.ajouterUnChoix('Choix 1');
        assert.deepEqual(scope.choix, ['Choix 1']);
    });

    it('ne peut pas ajouter le même choix deux fois', function () {
        scope.ajouterUnChoix('Choix 1');
        assert.deepEqual(scope.choix, ['Choix 1']);
        scope.ajouterUnChoix('Choix 1');
        assert.deepEqual(scope.choix, ['Choix 1']);
        assert.equal(scope.messageDErreur, "Il n'est pas possible d'ajouter deux fois le même choix");
    });

    it('ne peut pas ajouter un choix vide', function () {
        scope.ajouterUnChoix('');
        assert.deepEqual(scope.choix, []);
        assert.equal(scope.messageDErreur, "Vous ne pouvez pas ajouter un choix vide");
    });

    it('peut supprimer un choix', function () {
        scope.choix = ['Choix 1', 'Choix 2'];
        scope.supprimerUnChoix('Choix 1');
        assert.deepEqual(scope.choix, ['Choix 2']);
    });

    it("ajouter un choix valide supprime le message d'erreur et vide le nouveau choix", function () {
        scope.messageDErreur = "Vous ne pouvez pas ajouter un choix vide";
        scope.nouveauChoix = "Choix Valide";
        scope.ajouterUnChoix(scope.nouveauChoix);
        assert.equal(scope.messageDErreur, '');
        assert.equal(scope.nouveauChoix, '');
    });

    it("peut supprimer dernier choix", function () {
        scope.choix = ['Choix 1', 'Choix 2'];
        scope.supprimerDernierChoix();
        assert.deepEqual(scope.choix, ['Choix 1']);
    });

    it("peut créer une question", function () {
        var intitulé = 'question test';
        var choix = ['a', 'b'];
        http.expect('POST', '/votes', {intitulé: intitulé, choix: choix}).respond(200);
        scope.$apply(function () {
            scope.intitule = intitulé;
            scope.choix = choix;
        });
        scope.creerUnVote();
        assert.isUndefined(scope.messageDErreur);
        http.flush();
    });

/*
    describe('HTTP', function () {
        beforeEach(inject(function ($location) {
            location = $location;
            http.when('POST', '/votes').respond(201, {}, {'Location': '/votes/1234'});
        }));

        it("une fois la question créée, angular redirige vers la bonne page", function (done) {
            var intitulé = 'question test';
            var choix = ['a', 'b'];
            scope.$apply(function () {
                scope.intitule = intitulé;
                scope.choix = choix;
            });
            scope.creerUnVote();
            http.flush();
            assert.equal(location.path(), '/votes/1234/opinions');
        });

        afterEach(function () {
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });
    });
*/

});