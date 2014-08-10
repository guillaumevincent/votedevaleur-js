function QuestionADesChampsValides() {
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

    this.estRespectée = function (question) {

        var champs = Object.keys(question);
        if (champs.length === 0 || this.champsInterdit(champs)) {
            this.erreurs = [
                {"code": 1002, "message": "object question invalide"}
            ];
            return false;
        }

        if (!(question.hasOwnProperty('intitulé') && question.intitulé.length > 0)) {
            this.erreurs.push({"code": 1000, "message": "une question doit contenir un intitulé"})
        }

        if (!(question.hasOwnProperty('choix') && question.choix.length >= 2)) {
            this.erreurs.push({"code": 1001, "message": "une question doit contenir au moins 2 choix"})
        }

        return this.erreurs.length == 0;
    }
}

module.exports = {ChampsValides: QuestionADesChampsValides};


