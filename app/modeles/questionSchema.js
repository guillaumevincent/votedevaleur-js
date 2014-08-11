var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var questionSchema = new Schema({
    intitulé: String,
    choix: [String],
    opinions: [
        {
            electeur: String,
            notes: [
                {choix: String, valeur: Number}
            ]
        }
    ]
});

questionSchema.set('toJSON', { getters: true });

questionSchema.set('toObject', { getters: true });

function supprimerLesIds(question) {
    for (var i = 0; i < question.opinions.length; i++) {
        delete question.opinions[i]._id;
        var notes = question.opinions[i].notes;
        for (var j = 0; j < notes.length; j++) {
            delete notes[j]._id
        }
    }
    delete question._id;
    delete question.__v;
    return question;
}

questionSchema.method('toJSON', function (document) {
    var election = this.toObject();

    for (var key in document) {
        if (document.hasOwnProperty(key)) {
            election[key] = document[key];
        }
    }

    return supprimerLesIds(election);
});

module.exports = mongoose.model('Question', questionSchema);