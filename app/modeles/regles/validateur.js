function Validateur(vote, règles) {
    this.vote = vote;
    this.règles = règles;
    this.erreurs = [];

    this.verifierRègles = function (vote, règles) {
        var erreurs = [];
        for (var i = 0; i < règles.length; i++) {
            var règle = règles[i];
            if (!(règle.estRespectée(vote))) {
                erreurs = erreurs.concat(règle.erreurs);
            }
        }
        return erreurs
    };

    this.estValide = function () {
        this.erreurs = this.verifierRègles(this.vote, this.règles);
        return this.erreurs.length == 0;
    };
}

module.exports = Validateur;

