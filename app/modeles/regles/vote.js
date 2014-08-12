function VoteADesChampsValides() {
    this.erreurs = [];

    this.champsInterdit = function (champs) {
        var champAutorisés = ['intitulé', 'choix'];
        for (var i = 0; i < champs.length; i++) {
            if (champAutorisés.indexOf(champs[i]) == -1) {
                return true;
            }
        }
        return false;
    };

    this.estRespectée = function (vote) {

        var champs = Object.keys(vote);
        if (champs.length === 0 || this.champsInterdit(champs)) {
            this.erreurs = [
                {"code": 1002, "message": "object vote invalide"}
            ];
            return false;
        }

        if (!(vote.hasOwnProperty('intitulé') && vote.intitulé.length > 0)) {
            this.erreurs.push({"code": 1000, "message": "un vote doit contenir un intitulé"})
        }

        if (!(vote.hasOwnProperty('choix') && vote.choix.length >= 2)) {
            this.erreurs.push({"code": 1001, "message": "un vote doit contenir au moins 2 choix"})
        }

        return this.erreurs.length == 0;
    }
}

module.exports = {ChampsValides: VoteADesChampsValides};


