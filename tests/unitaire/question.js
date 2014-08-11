var Question = require('../../app/modeles/question'),
    ValidateurDeQuestion = require('../../app/modeles/regles/validateur'),
    assert = require('assert');

describe('une question', function () {
    var intitulé;
    var choix;
    var question;
    var opinion;

    beforeEach(function () {
        intitulé = 'Simple Question';
        choix = ['choix 1', 'choix 2'];
        question = new Question({intitulé: intitulé, choix: choix});
        opinion = {
            electeur: "Prénom Nom",
            notes: [
                {choix: 'choix 1', valeur: 2},
                {choix: 'choix 2', valeur: 0}
            ]
        };
    });

    it('doit avoir un intitulé, des choix et des opinions', function () {
        assert.equal(question.intitulé, intitulé);
        assert.deepEqual(question.choix, choix);
        assert.deepEqual(question.opinions, []);
    });

    it('peut être instancié avec des opinions', function () {
        var questionComplète = new Question({intitulé: intitulé, choix: choix, opinions: [opinion]});
        assert.equal(questionComplète.intitulé, intitulé);
        assert.deepEqual(questionComplète.choix, choix);
        assert.deepEqual(questionComplète.opinions, [opinion]);
    });


    it("peut recevoir une opinion d'un electeur", function () {
        question.ajouterUneOpinion(opinion);
        assert.deepEqual(question.opinions, [opinion]);
    });

    it("a une réponse s'il y a au moins une opinion", function () {
        question.ajouterUneOpinion(opinion);
        assert.deepEqual(question.obtenirUneRéponse(), ['choix 1']);
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
        assert.deepEqual(question.compterOpinions(opinions), opinionsComptéesAttendues);
    });

    it("peut retourner le maximum des résultats", function () {
        // todo déplacer la fonction récupérerLaListeDesMeilleursChoix dans une boite à outil JS
        var résultats = {"Choix 1": 0, "Choix 2": 4};
        assert.deepEqual(question.récupérerLaListeDesMeilleursChoix(résultats), ['Choix 2']);
        var autreRésultats = {"Choix 1": -1, "Choix 2": -1};
        assert.deepEqual(question.récupérerLaListeDesMeilleursChoix(autreRésultats), ['Choix 1', 'Choix 2']);
    });

    it("a deux réponses à égalité s'il les choix ont le même score", function () {
        var autreOpinion = {
            electeur: "Prénom Nom",
            notes: [
                {choix: 'Choix 1', valeur: 2},
                {choix: 'Choix 2', valeur: 2}
            ]
        };
        question.ajouterUneOpinion(autreOpinion);
        assert.deepEqual(question.obtenirUneRéponse(), ['Choix 1', 'Choix 2']);
    });
});

describe("le validateur d'une question", function () {
    var question;
    var règles;
    var validateurDeQuestion;

    beforeEach(function () {
        question = {"intitulé": "Nouvelle question", "choix": ["Choix 1", "Choix 2"]};
        function Règle1() {
            this.estRespectée = function () {
                return true;
            };
        }

        règles = [new Règle1()];
        validateurDeQuestion = new ValidateurDeQuestion(question, règles);
    });

    it('prend une question et un ensemble de règles en paramètre et retourne une question validée', function () {
        assert.deepEqual(validateurDeQuestion.question, question);
    });

    it('offre une methode estValide et a un attribut erreurs', function () {
        assert.ok(validateurDeQuestion.estValide());
        assert.deepEqual(validateurDeQuestion.erreurs, []);
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

        var mauvaisValidateur = new ValidateurDeQuestion(question, [new Règle2(), new Règle3()]);
        assert.equal(mauvaisValidateur.estValide(), false);
        assert.deepEqual(mauvaisValidateur.erreurs, erreurs);
    });
});