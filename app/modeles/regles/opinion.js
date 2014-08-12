function OpinionADesChampsValides() {
    this.erreurs = [];

    this.champsValides = function (champs, valeurAcceptées) {
        if (champs.length === 0) {
            return false;
        }
        for (var i = 0; i < champs.length; i++) {
            if (valeurAcceptées.indexOf(champs[i]) == -1) {
                return false;
            }
        }
        return true;
    };


    function objetInvalide() {
        return {"code": 1002, "message": "object vote invalide"};
    }

    this.notesValides = function (notes) {
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var champsNote = Object.keys(note);
            if (!this.champsValides(champsNote, ['choix', 'valeur'])) {
                return objetInvalide();
            }

            if (note.valeur < -2 || note.valeur > 2) {
                return {"code": 2001, "message": "le valeur d'un choix doit être compris entre -2 et 2"};
            }
        }
    };

    this.estRespectée = function (opinion) {

        var champs = Object.keys(opinion);
        if (!this.champsValides(champs, ['electeur', 'notes'])) {
            this.erreurs.push(objetInvalide());
        }

        if (!(opinion.hasOwnProperty('electeur') && opinion.electeur.length > 0)) {
            this.erreurs.push({"code": 2000, "message": "une opinion doit être portée par un electeur"})
        }

        if (opinion.hasOwnProperty('notes') && opinion.notes.length > 0) {
            var notes = opinion.notes;
            var erreurs = this.notesValides(notes);
            if (erreurs) {
                this.erreurs.push(erreurs);
            }

        }
        return this.erreurs.length == 0;
    }
}

module.exports = {ChampsValides: OpinionADesChampsValides};


