var assert = chai.assert;

describe('Opinion Application', function () {

    beforeEach(module('opinionApplication'));

    describe('opinion ctrl', function () {
        var scope, httpBackend, controller;

        beforeEach(inject(function ($rootScope, $httpBackend, $controller) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            var mockLocation = {absUrl: function () {
                return 'http://localhost/question/123456/opinions'
            }};
            controller = $controller('opinionControleur', {$scope: scope, $location: mockLocation});
        }));

        it("récupérer l'id d'une question dans l'url", function () {
            var questionId = scope.récupérerIdQuestion('http://localhost:3000/questions/53df26c3e817099475bd59db/opinions');
            assert.equal(questionId, '53df26c3e817099475bd59db')
        });

        it('doit créer une opinion vide basé sur les choix', function () {
            scope.choix = ['Choix 1', 'Choix 2'];
            scope.creerOpinionVide();
            var opinionAttenue = {electeur: '', notes: [
                {choix: 'Choix 1', valeur: 0},
                {choix: 'Choix 2', valeur: 0}
            ]};
            assert.deepEqual(scope.opinion, opinionAttenue);
        });

    });

});