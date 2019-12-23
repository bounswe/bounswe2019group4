var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var supertest = require("supertest");

chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("localhost:8080");

// UNIT test begin

describe("Events",function(){

    it("should list events on GET",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/events')
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
  
    it("should returns details of a specific events on GET",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/events/227607')
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
  
    it("should returns not found on GET",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/events/123123123')
      .expect("Content-type",/json/)
      .expect(404)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(404);
        done();
      });
    });
  
  });
  