const { app, server } = require('../../index')
const mocha = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should();

describe('user actions tests', () => {
  after((done) => {
    require('./../dropDatabase')
    done()
  })

  context('create new user', () =>  {

    it('should return 422', (done) => {
      chai.request(app)
        .post('/api/v1/user')
        .type('form')
        .send({
          "email" : "test"
        }).end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object')
          res.body.errors.should.be.a('array')
          done()
        })
    })

    it('should create new user', (done) => {
      chai.request(app)
        .post('/api/v1/user')
        .type('form')
        .send({
          "email" : "test@test.com",
          "name" : "Test",
          "password" : "Password123!",
          "password_confirmation" : "Password123!"
        }).end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        });
    })
  })
})


