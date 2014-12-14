var applicationVotedevaleur = angular.module('votedevaleur', ['ngRoute']);


applicationVotedevaleur.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'vues/question.html',
            controller: 'questionControleur'
        });
});

applicationVotedevaleur.controller('questionControleur', ['$scope', '$http', function (scope, http) {
    scope.message = 'alors ce message';
}]);