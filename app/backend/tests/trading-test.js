var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var supertest = require("supertest");

chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("localhost:8080");

// UNIT test begin

describe("Trading Eqs",function(){

    it("should return usd data",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/trading-equipments/usd')
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
  
    it("should return no such currency",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/trading-equipments/trry')
      .expect("Content-type",/json/)
      .expect(400)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(400);
        done();
      });
    });
  
  });
  
  