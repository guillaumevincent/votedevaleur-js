var Vote = require('../../app/modeles/vote'),
    VoteValidateur = require('../../app/modeles/regles/validateur'),
    assert = require('assert');

describe('un vote', function () {
    var intitulé;
    var choix;
    var vote;
    var opinion;

    beforeEach(function () {
        intitulé = 'Simple Vote';
        choix = ['choix 1', 'choix 2'];
        vote = new Vote({intitulé: intitulé, choix: choix});
        opinion = {
            electeur: "Prénom Nom",
            notes: [
                {choix: 'choix 1', valeur: 2},
                {choix: 'choix 2', valeur: 0}
            ]
        };
    });

    it('doit avoir un intitulé, des choix et des opinions', function () {
        assert.equal(vote.intitulé, intitulé);
        assert.deepEqual(vote.choix, choix);
        assert.deepEqual(vote.opinions, []);
    });

    it('peut être instancié avec des opinions', function () {
        var nouveauVote = new Vote({intitulé: intitulé, choix: choix, opinions: [opinion]});
        assert.equal(nouveauVote.intitulé, intitulé);
        assert.deepEqual(nouveauVote.choix, choix);
        assert.deepEqual(nouveauVote.opinions, [opinion]);
    });


    it("peut recevoir une opinion d'un electeur", function () {
        vote.ajouterUneOpinion(opinion);
        assert.deepEqual(vote.opinions, [opinion]);
    });

    it("a une réponse s'il y a au moins une opinion", function () {
        vote.ajouterUneOpinion(opinion);
        assert.deepEqual(vote.obtenirUneRéponse(), ['choix 1']);
    });

    it('doit compter les notes de chaque opinion', function () {
        var opinions = [
            {
                electeur: 'Prénom Nom',
                notes: [
                    {choix: 'Choix 1', valeur: 1},
                    {choix: 'Choix 2', valeur: 2}
                ]
            },
            {
                electeur: 'Prénom Nom',
                notes: [
                    {choix: 'Choix 1', valeur: -1},
                    {choix: 'Choix 2', valeur: 2}
                ]
            }
        ];
        var opinionsComptéesAttendues = {"Choix 1": 0, "Choix 2": 4};
        assert.deepEqual(vote.compterOpinions(opinions), opinionsComptéesAttendues);
    });

    it("peut retourner le maximum des résultats", function () {
        // todo déplacer la fonction récupérerLaListeDesMeilleursChoix dans une boite à outil JS
        var résultats = {"Choix 1": 0, "Choix 2": 4};
        assert.deepEqual(vote.récupérerLaListeDesMeilleursChoix(résultats), ['Choix 2']);
        var autreRésultats = {"Choix 1": -1, "Choix 2": -1};
        assert.deepEqual(vote.récupérerLaListeDesMeilleursChoix(autreRésultats), ['Choix 1', 'Choix 2']);
    });

    it("a deux réponses à égalité s'il les choix ont le même score", function () {
        var autreOpinion = {
            electeur: "Prénom Nom",
            notes: [
                {choix: 'Choix 1', valeur: 2},
                {choix: 'Choix 2', valeur: 2}
            ]
        };
        vote.ajouterUneOpinion(autreOpinion);
        assert.deepEqual(vote.obtenirUneRéponse(), ['Choix 1', 'Choix 2']);
    });
});

describe("le validateur d'un vote", function () {
    var vote;
    var règles;
    var validateur;

    beforeEach(function () {
        vote = {"intitulé": "Nouveau vote", "choix": ["Choix 1", "Choix 2"]};
        function Règle1() {
            this.estRespectée = function () {
                return true;
            };
        }

        règles = [new Règle1()];
        validateur = new VoteValidateur(vote, règles);
    });

    it('prend une vote et un ensemble de règles en paramètre et retourne une vote validée', function () {
        assert.deepEqual(validateur.vote, vote);
    });

    it('offre une methode estValide et a un attribut erreurs', function () {
        assert.ok(validateur.estValide());
        assert.deepEqual(validateur.erreurs, []);
    });

    it("parcours l'ensemble des règles", function () {
        var erreurs = [
            {"code": 1000, "message": "erreur 1"},
            {"code": 1001, "message": "erreur 2"}
        ];

        function Règle2() {
            this.erreurs = [erreurs[0]];
            this.estRespectée = function () {
                return false;
            };
        }

        function Règle3() {
            this.erreurs = [erreurs[1]];
            this.estRespectée = function () {
                return false;
            };
        }

        var mauvaisValidateur = new VoteValidateur(vote, [new Règle2(), new Règle3()]);
        assert.equal(mauvaisValidateur.estValide(), false);
        assert.deepEqual(mauvaisValidateur.erreurs, erreurs);
    });
});