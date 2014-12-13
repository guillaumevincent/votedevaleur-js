var mongoose = require('mongoose'),
    config = require('config'),
    shortId = require('shortid');

shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@');

mongoose.connect(config.databaseUrl);

var voteSchema = mongoose.Schema({
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

voteSchema.set('toJSON', { getters: true });

voteSchema.set('toObject', { getters: true });

function supprimerLesIds(vote) {
    for (var i = 0; i < vote.opinions.length; i++) {
        delete vote.opinions[i]._id;
        var notes = vote.opinions[i].notes;
        for (var j = 0; j < notes.length; j++) {
            delete notes[j]._id
        }
    }
    delete vote._id;
    delete vote.__v;
    return vote;
}

voteSchema.method('toJSON', function (document) {
    var vote = this.toObject();

    for (var key in document) {
        if (document.hasOwnProperty(key)) {
            vote[key] = document[key];
        }
    }

    return supprimerLesIds(vote);
});

voteSchema = mongoose.model('DépotVote', voteSchema);

exports.sauvegarde = function (vote, callback) {

    voteSchema(vote).save(function (erreurs, nouveauVote) {
        callback(nouveauVote, erreurs);
    });

};

exports.récupére = function (recherche, callback) {
    voteSchema.findOne(recherche, function (err, vote) {
        callback(vote, err);
    });
};

exports.récupéreAvecId = function (id, callback) {
    voteSchema.findById(id, function (erreurs, vote) {
        callback(vote, erreurs)
    });
};


exports.mettreAJour = function (id, nouvellesDonnées, callback) {

    voteSchema.findByIdAndUpdate(id, {$set: nouvellesDonnées}, function (err, vote) {
            callback(vote, err);
        }
    );
};
