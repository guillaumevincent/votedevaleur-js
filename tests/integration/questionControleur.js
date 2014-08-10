var request = require('supertest'),
    app = require('../../serveur');

describe('[API] controleur de question', function () {
    it("respond avec 400 Bad Request si la question passée dans le corps de la réquète n'est pas bon", function (done) {
        var errors = [
            {"code": 1002, "message": "object question invalide"}
        ];
        request(app)
            .post('/questions')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400, errors, done);
    });

});