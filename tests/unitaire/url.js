//var url = require('../../app/modeles/url');
var assert = require('assert');
function Url(urlRelative) {
    this.urlRelative = urlRelative;
    this.raccourci = '123456';

}
describe('une url', function () {


    beforeEach(function () {

    });

    it('doit avoir une méthode de réduction de longeur bijective', function () {
        var urlRelative = '/questions/53e8f8ea73b9d10000222ffe/opinions';
        var url = new Url(urlRelative);
        assert.equal(url.raccourci.length, 6);

    });
});