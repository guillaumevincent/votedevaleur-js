var questionApplication = angular.module('questionApplication', ['cfp.hotkeys']);

questionApplication.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

questionApplication.controller('questionControleur', function ($scope, $http, $window, hotkeys) {

    $scope.intitule = '';
    $scope.choix = [];

    $scope.estValide = false;

    $scope.$watchCollection('choix', function (nouveauChoix, anciensChoix) {
        $scope.estValide = ($scope.intitule.length > 0 && nouveauChoix.length >= 2);
    });

    $scope.ajouterUnChoix = function (choix) {
        if (choix) {
            if ($scope.choix.indexOf(choix) == -1) {
                $scope.choix.push(choix);
                $scope.messageDErreur = '';
                $scope.nouveauChoix = '';
            } else {
                $scope.messageDErreur = "Il n'est pas possible d'ajouter deux fois le même choix";
            }
        } else {
            $scope.messageDErreur = "Vous ne pouvez pas ajouter un choix vide";
        }
    };

    $scope.supprimerUnChoix = function (nomDuChoix) {
        var choix = $scope.choix;
        var index = choix.indexOf(nomDuChoix);
        if (index >= 0) {
            choix.splice(index, 1);
        }
    };

    $scope.creerQuestion = function () {
        if ($scope.estValide) {
            $http.post('/questions', {intitulé: $scope.intitule, choix: $scope.choix}).
                success(function (data, status, headers, config) {
                    $window.location.href = headers('Location') + '/opinions';
                }).
                error(function (data, status, headers, config) {
                    $scope.messageDErreur = "L'accès au serveur n'est pas possible, retentez dans quelques instants";
                });
        } else {
            $scope.messageDErreur = "Une question a besoin d'un intitulé et de deux choix au minimum"
        }
    };

    $scope.supprimerDernierChoix = function () {
        $scope.choix.pop();
    };

    hotkeys.add({
        combo: ['command+s', 'ctrl+s'],
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event, hotkey) {
            $scope.creerQuestion();
            event.preventDefault();
        }
    });

    hotkeys.add({
        combo: ['ctrl+z', 'command+z'],
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event, hotkey) {
            $scope.supprimerDernierChoix();
        }
    });

});