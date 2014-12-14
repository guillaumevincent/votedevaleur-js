var applicationVotedevaleur = angular.module('votedevaleur', ['ngRoute']);


applicationVotedevaleur.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'vues/question.html',
            controller: 'questionControleur'
        });
});

applicationVotedevaleur.controller('questionControleur', ['$scope', '$http', function (scope, http) {
    scope.message = 'alors ce message';
}]);