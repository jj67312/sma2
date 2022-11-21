let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

const UserModel = require('../models/UserModel');
const Portfolio = require('../models/PortfolioModel');

async function findPortfolio() {
  const user = await UserModel.findById('636831a68bea22ab802e2827');
  // console.log(user.portfolios[0].toString());
  return user.portfolios[0].toString();
}

chai.should();
chai.use(chaiHttp);

let userId = '636831a68bea22ab802e2827';
let portfolioId = 0;

findPortfolio().then((data) => {
  portfolioId = data;
});

describe('Portfolio', () => {
  describe('Test 1 : Correct details for viewing all portfolios', () => {
    it('It should get all the portfolios', (done) => {
      chai
        .request(server)
        .get('/portfolio/test/' + userId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('_id');
          res.body.should.have.property('portfolios');
          res.body.should.have.property('username');
          done();
        });
    });
  });

  describe('Test 2 : Incorrect details for viewing all portfolios ', (done) => {
    it('It should not get the portfolios for user that does not exist', (done) => {
      chai
        .request(server)
        .get('/portfolio/test/123')
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq('User does not exist');
          done();
        });
    });
  });

  describe('Test 3 : Correct details to view a specific portfolio', () => {
    it('It should get the portfolio by id', (done) => {
      chai
        .request(server)
        .get('/portfolio/test/' + userId + '/' + portfolioId)
        .end((err, res) => {
          // console.log(res.body)
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('stocks');
          res.body.should.have.property('owner');
          done();
        });
    });
  });

  describe('Test 4 : Incorrect details to view a specific portfolio', () => {
    it('It should get the portfolio if portfolio does not exists', (done) => {
      chai
        .request(server)
        .get('/portfolio/test/' + userId + '/123')
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq('Portfolio does not exist');
          done();
        });
    });
  });

  describe('Test 5 : Correct details to creating new portfolio', () => {
    it('It should create a new portfolio', (done) => {
      let name = 'Test-portfolio';
      chai
        .request(server)
        .post('/portfolio/test/' + userId)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name })
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('owner').eql(userId);
          res.body.should.have.property('stocks');
          done();
        });
    });
  });

  describe('Test 6 : Missing details for creating new portfolio', () => {
    it('It should not create new portfolio if details are missing', (done) => {
      let name;
      chai
        .request(server)
        .post('/portfolio/test/' + userId)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('Test 7 : Correct details for deleting a portfolio', () => {
    it('It should delete an existing portfolio', (done) => {
      chai
        .request(server)
        .delete('/portfolio/test/' + userId + '/' + portfolioId)
        .end((err, res) => {
          // console.log('/portfolio/' + userId + '/' + portfolioId);
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Test 8 : Incorrect details for deleting a portfolio', () => {
    it('It should not delete a portfolio which does not exist', (done) => {
      chai
        .request(server)
        .delete('/portfolio/test/' + userId + '/123')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
