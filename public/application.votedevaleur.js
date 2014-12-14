var applicationVotedevaleur = angular.module('votedevaleur', ['ngRoute', 'cfp.hotkeys']);


applicationVotedevaleur.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'vues/question.html',
            controller: 'questionControleur'
        })
        .when('/opinions', {
            templateUrl: 'vues/opinion.html',
            controller: 'opinionControleur'
        }).
        otherwise({
            redirectTo: '/'
        });
});

applicationVotedevaleur.controller('questionControleur', ['$scope', '$http', 'hotkeys', '$location', function (scope, http, hotkeys, location) {
    scope.intitule = '';
    scope.choix = [];

    scope.estValide = false;

    scope.$watchCollection('choix', function (choix) {
        scope.estValide = (scope.intitule.length > 0 && choix.length >= 2);
    });

    scope.ajouterUnChoix = function (choix) {
        if (choix) {
            if (scope.choix.indexOf(choix) == -1) {
                scope.choix.push(choix);
                scope.messageDErreur = '';
                scope.nouveauChoix = '';
            } else {
                scope.messageDErreur = "Il n'est pas possible d'ajouter deux fois le même choix";
            }
        } else {
            scope.messageDErreur = "Vous ne pouvez pas ajouter un choix vide";
        }
    };

    scope.supprimerUnChoix = function (nomDuChoix) {
        var choix = scope.choix;
        var index = choix.indexOf(nomDuChoix);
        if (index >= 0) {
            choix.splice(index, 1);
        }
    };

    scope.creerUnVote = function () {
        if (scope.estValide) {
            http.post('/votes', {intitulé: scope.intitule, choix: scope.choix}).
                success(function (data, status, headers, config) {
                    location.url(headers('Location') + '/opinions');
                }).
                error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    scope.messageDErreur = "L'accès au serveur n'est pas possible, retentez dans quelques instants";
                });
        } else {
            scope.messageDErreur = "Une vote a besoin d'un intitulé et de deux choix au minimum"
        }
    };

    scope.supprimerDernierChoix = function () {
        scope.choix.pop();
    };

    hotkeys.add({
        combo: ['command+s', 'ctrl+s'],
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event, hotkey) {
            scope.creerUnVote();
            event.preventDefault();
        }
    });

    hotkeys.add({
        combo: ['ctrl+z', 'command+z'],
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event, hotkey) {
            scope.supprimerDernierChoix();
        }
    });

}]);