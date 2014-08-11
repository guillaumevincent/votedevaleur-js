function Validateur(question, règles) {
    this.question = question;
    this.règles = règles;
    this.erreurs = [];

    this.verifierRègles = function (question, règles) {
        var erreurs = [];
        for (var i = 0; i < règles.length; i++) {
            var règle = règles[i];
            if (!(règle.estRespectée(question))) {
                erreurs = erreurs.concat(règle.erreurs);
            }
        }
        return erreurs
    };

    this.estValide = function () {
        this.erreurs = this.verifierRègles(this.question, this.règles);
        return this.erreurs.length == 0;
    };
}

module.exports = Validateur;

