var opinionApplication = angular.module('opinionApplication', []);

opinionApplication.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

opinionApplication.controller('opinionControleur', function ($scope, $http, $location) {

    $scope.opinions = [];
    $scope.opinion = {};
    $scope.reponses = [];
    $scope.choix = [];
    $scope.urlRaccourci = '';

    $scope.récupérerIdVote = function (url) {
        var url_split = url.split('/');
        var indexOfId = url_split.indexOf('votes') + 1;
        return url_split[indexOfId];
    };

    $scope.idVote = $scope.récupérerIdVote($location.absUrl());

    $scope.creerOpinionVide = function () {
        var choix = $scope.choix;
        var notes = [];
        for (var i = 0; i < choix.length; i++) {
            notes.push({choix: choix[i], valeur: 0})
        }
        $scope.opinion = {electeur: '', notes: notes}
    };

    $scope.récupérerVote = function () {

        $http.get('/votes/' + $scope.idVote).
            success(function (données, status, headers, config) {
                console.log($location);
                $scope.intitule = données.intitulé;
                $scope.urlRaccourci = window.location.origin + '/'+ données.idRaccourci;
                $scope.opinions = données.opinions;
                $scope.reponses = données.réponses;
                $scope.choix = données.choix;
                if (données.choix) {
                    $scope.creerOpinionVide();
                }
            }).error(function (data, status, headers, config) {
                $scope.messageDErreur = "L'accès au serveur n'est pas possible, retentez dans quelques instants";
            });
    };

    $scope.récupérerVote();

    $scope.ajouterOpinion = function () {
        if ($scope.opinion.electeur.length == 0) {
            $scope.messageDErreur = "vous devez renseignez votre nom pour donner votre opinion";
        } else {
            $http.post('/votes/' + $scope.idVote + '/opinions', $scope.opinion).
                success(function (data, status, headers, config) {
                    location.reload();
                }).error(function (data, status, headers, config) {
                    $scope.messageDErreur = "L'accès au serveur n'est pas possible, retentez dans quelques instants";
                });
        }
    };

});