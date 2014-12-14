var assert = chai.assert;

describe("Controleur d'opinion", function () {

    beforeEach(module('votedevaleur'));

    var scope, httpBackend, controller;

    beforeEach(inject(function ($rootScope, $httpBackend, $controller) {
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        var mockLocation = {
            absUrl: function () {
                return 'http://localhost/vote/123456/opinions'
            }
        };
        controller = $controller('opinionControleur', {$scope: scope, $location: mockLocation});
    }));

    it("récupérer l'id d'une vote dans l'url", function () {
        var idVote = scope.récupérerIdVote('http://localhost:3000/votes/53df26c3e817099475bd59db/opinions');
        assert.equal(idVote, '53df26c3e817099475bd59db')
    });

    it('doit créer une opinion vide basé sur les choix', function () {
        scope.choix = ['Choix 1', 'Choix 2'];
        scope.creerOpinionVide();
        var opinionAttenue = {
            electeur: '', notes: [
                {choix: 'Choix 1', valeur: 0},
                {choix: 'Choix 2', valeur: 0}
            ]
        };
        assert.deepEqual(scope.opinion, opinionAttenue);
    });


});