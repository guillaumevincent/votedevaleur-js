var questionApplication = angular.module('opinionApplication', ['cfp.hotkeys']);

questionApplication.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

questionApplication.controller('opinionControleur', function ($scope, $http, $location, hotkeys) {

    $scope.récupérerIdQuestion = function (url) {
        var url_split = url.split('/');
        var indexOfId = url_split.indexOf('questions') + 1;
        return url_split[indexOfId];
    };

    $scope.idQuestion = $scope.récupérerIdQuestion($location.absUrl());


});