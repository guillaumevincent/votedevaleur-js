var assert = chai.assert;

describe('Question Application', function () {

    var scope, httpBackend, controller, $window;

    beforeEach(module('questionApplication'));


    describe('Question Controleur', function () {

        beforeEach(inject(function ($rootScope, $httpBackend, $controller) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            controller = $controller('questionControleur', {$scope: scope});
        }));

        it('Quand le scope est chargé il y a des choix et un intitulé', function () {
            assert.deepEqual(scope.choix, []);
            assert.equal(scope.intitule, '');
        });

        it('estValide si il y a au moins un intitulé et 2 choix', function () {
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

    });
});