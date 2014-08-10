var questionApplication = angular.module('questionApplication', []);

questionApplication.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

questionApplication.controller('creerQuestionControleur', function ($scope, $http, $window) {

    $scope.intitule = '';
    $scope.choix = [];

    $scope.estValide = false;

    $scope.$watchCollection('choix', function (nouveauChoix, anciensChoix) {
        if ($scope.intitule.length > 0 && nouveauChoix.length >= 2) {
            $scope.estValide = true;
        }
    });

    $scope.ajouterUnChoix = function (choix) {
        if (choix) {
            if ($scope.choix.indexOf(choix) == -1) {
                $scope.choix.push(choix);
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

        $http.post('/questions', {intitulé: $scope.intitule, choix: $scope.choix}).
            success(function (data, status, headers, config) {
                $window.location.href = headers('Location') + '/notez';
            }).
            error(function (data, status, headers, config) {
                $scope.messageDErreur = "L'accès au serveur n'est pas possible, retentez dans quelques instants";
            });
    };
});