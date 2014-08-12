var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortId = require('shortid');

shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@');

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
    ],
    idRaccourci: {
        type: String,
        unique: true,
        'default': shortId.generate
    }
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
    var question = this.toObject();

    for (var key in document) {
        if (document.hasOwnProperty(key)) {
            question[key] = document[key];
        }
    }

    return supprimerLesIds(question);
});

module.exports = mongoose.model('Question', questionSchema);