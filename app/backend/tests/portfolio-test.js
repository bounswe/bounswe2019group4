var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var supertest = require("supertest");

chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("localhost:8080");

// UNIT test begin

describe("Portfolio",function(){
    it("should returns details of a specific portfolio on GET",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/portfolios/5ddb04331d01120dba5c7a2a')
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('Object');
        done();
      });
    });
  
    it("should return unauthorized on DELETE",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .delete('/portfolios/123132')
      .expect(401)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(401);
        done();
      });
    });
  
    it("should return unauthorized on PATCH",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .patch('/portfolios/123132')
      .send({
        "title": "Favourite Trading Equipments",
        "definition": "This portfolio includes my favourite trading equipments",
        "isPrivate": false,
        "tradingEqs": [
            "TRY",
            "USD",
            "EUR"
        ]
    }
    )
      .expect(401)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(401);
        done();
      });
    });
  
    it("should return bad request on PATCH",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .patch('/portfolios/123132')
      .expect(400)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(400);
        done();
      });
    });
  });