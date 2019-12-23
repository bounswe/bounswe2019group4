var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var supertest = require("supertest");

chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("localhost:8080");

// UNIT test begin

describe("What did you mean?",function(){
  it("should returns what did you mean on a wrong endpoint GET",function(done){
    this.timeout(30000) // all tests in this suite get 30 seconds before timeout
    server
    .get('/random_endpoint/')
    .expect(404)
    .end(function(err,res){
        should.equal(err, null);
        res.should.have.status(404);
      done();
    });
  });

  it("should returns what did you mean on a wrong request type",function(done){
    this.timeout(30000) // all tests in this suite get 30 seconds before timeout
    server
    .post('/events/')
    .expect(404)
    .end(function(err,res){
        should.equal(err, null);
        res.should.have.status(404);
      done();
    });
  });
  
});
