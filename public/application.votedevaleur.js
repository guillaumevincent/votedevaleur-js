var applicationVotedevaleur = angular.module('votedevaleur', ['ngRoute', 'cfp.hotkeys', 'ngResource']);


applicationVotedevaleur.config(['$routeProvider', '$locationProvider', '$resourceProvider', function ($routeProvider, $locationProvider, $resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'vues/vote.html',
            controller: 'voteControleur'
        })
        .when('/votes/:voteId/admin', {
            templateUrl: 'vues/adminVote.html',
            controller: 'voteControleur'
        })
        .when('/votes/:voteId/opinions', {
            templateUrl: 'vues/opinion.html',
            controller: 'opinionControleur'
        })
        .when('/votes/:voteId/resultats', {
            templateUrl: 'vues/resultat.html',
            controller: 'opinionControleur'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

angular.module('votedevaleur').controller('voteControleur', ['$scope', '$location', '$routeParams', 'Votes', 'hotkeys', function (scope, location, routeParams, Votes, hotkeys) {
    scope.intitule = '';
    scope.choix = [];

    scope.estValide = false;

    scope.$watchCollection('choix', function (choix) {
        scope.estValide = (scope.intitule.length > 0 && choix.length >= 2);
    });

    scope.ajouterUnChoixEtFocusChampTexte = function (choix) {
        scope.ajouterUnChoix(choix);
        document.getElementById("nouveauChoix").focus();
    };

    function contains(object, array) {
        return _.where(array, object).length > 0;
    }

    scope.ajouterUnChoix = function (valeurChoix) {
        if (valeurChoix) {
            var choix = {valeur: valeurChoix};
            if (contains(choix, scope.choix)) {
                scope.messageDErreur = "Il n'est pas possible d'ajouter deux fois le même choix";
            } else {
                scope.choix.push(choix);
                scope.messageDErreur = '';
                scope.nouveauChoix = '';
            }
        } else {
            scope.messageDErreur = "Vous ne pouvez pas ajouter un choix vide";
        }
    };

    scope.creerUnVote = function () {
        if (scope.estValide) {
            var vote = {intitulé: scope.intitule, choix: _.pluck(scope.choix, 'valeur')};
            Votes.save(vote, function success(vote, headers) {
                location.url(headers('Location') + '/admin');
            });
        } else {
            scope.messageDErreur = "Un vote a besoin d'un intitulé et de deux choix au minimum"
        }
    };

    scope.supprimerDernierChoix = function () {
        scope.choix.pop();
    };

    scope.supprimerChoix = function (choixASupprimer) {
        _.remove(scope.choix, function (currentObject) {
            return currentObject == choixASupprimer;
        });
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


    var voteId = routeParams.voteId;
    if (voteId !== undefined) {
        Votes.get({id: voteId}).$promise.then(function (vote) {
            scope.vote = vote;
        });
    }

}]);


angular.module('votedevaleur').controller('opinionControleur', ['$scope', '$location', '$routeParams', 'Votes', 'Opinions', function (scope, location, routeParams, Votes, Opinions) {
    scope.opinions = [];
    scope.opinion = {};
    scope.reponses = [];
    scope.choix = [];

    scope.creerOpinionVide = function () {
        var choix = scope.choix;
        var notes = [];
        for (var i = 0; i < choix.length; i++) {
            notes.push({choix: choix[i], valeur: 0})
        }
        scope.opinion = {electeur: '', notes: notes}
    };

    var voteId = routeParams.voteId;
    Votes.get({id: voteId}).$promise.then(function (vote) {
        scope.intitule = vote.intitulé;
        scope.idRaccourci = vote.idRaccourci;
        scope.opinions = vote.opinions;
        scope.reponses = vote.réponses;
        scope.choix = vote.choix;
        if (vote.choix) {
            scope.creerOpinionVide();
        }
    });

    scope.ajouterOpinion = function () {
        if (scope.opinion.electeur.length == 0) {
            scope.messageDErreur = "vous devez renseignez votre nom pour donner votre opinion";
        } else {
            Opinions.save({voteId: voteId}, scope.opinion, function success(opinion, headers) {
                location.url('/votes/' + voteId + '/resultats');
            });
        }
    };
}]);


angular.module('votedevaleur').factory('Votes', ['$resource', function ($resource) {
    return $resource("/votes/:id");
}]);

angular.module('votedevaleur').factory('Opinions', ['$resource', function ($resource) {
    return $resource("/votes/:voteId/opinions/:id");
}]);