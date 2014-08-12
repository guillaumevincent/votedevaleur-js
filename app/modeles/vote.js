function Vote(vote) {
    this.intitulé = vote.intitulé;
    this.choix = vote.choix;
    this.opinions = typeof vote.opinions === 'undefined' ? [] : vote.opinions;

    this.ajouterUneOpinion = function (opinion) {
        this.opinions.push(opinion);
    };

    this.compterOpinions = function (opinions) {
        var résultats = {};
        opinions.forEach(function (opinion) {
            opinion.notes.forEach(function (note) {
                if (note.choix in résultats) {
                    résultats[note.choix] += note.valeur;
                } else {
                    résultats[note.choix] = note.valeur;
                }
            });
        });
        return résultats
    };

    this.récupérerLaListeDesMeilleursChoix = function (plusieursChoix) {
        var meilleursChoix = [];
        var valeurMaximum;
        Object.keys(plusieursChoix).forEach(function (choix) {
            var valeurDuChoix = plusieursChoix[choix];
            if (typeof valeurMaximum === 'undefined' || valeurDuChoix > valeurMaximum) {
                meilleursChoix = [choix];
                valeurMaximum = valeurDuChoix;
            } else if (valeurDuChoix == valeurMaximum) {
                meilleursChoix.push(choix)
            }
        });
        return meilleursChoix
    };

    this.obtenirUneRéponse = function () {
        var opinionsComptées = this.compterOpinions(this.opinions);
        return this.récupérerLaListeDesMeilleursChoix(opinionsComptées)
    };
}

module.exports = Vote;

