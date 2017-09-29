const expect = require('chai').expect;
const request = require('supertest');

describe('Search Tweets API Should Work', function () {
    var server, userCollection;
    beforeEach(function () {
        server = require('./server');
    });
    afterEach(function () {
        server.close();
    });
    it('should work', function () {
        expect(true).to.be.true;
    });
    it('responds to /', function (done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('should should fetch 10 tweets based on search string', function (done) {
        request(server)
            .get('/search?q=singapore')
            .expect(200)
            .expect(function (res) {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(10);
                
            })
            .end(done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });

})