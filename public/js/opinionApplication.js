var opinionApplication = angular.module('opinionApplication', []);

opinionApplication.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

opinionApplication.controller('opinionControleur', function (scope, $http, $location) {


});