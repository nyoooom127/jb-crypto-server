const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('general', () => {
    it('should have a link to connect', (done) => {
        chai.request(server)
            .get('/welcome')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.text).to.contain('Connect');
                done();
            });
    });
});