var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var supertest = require("supertest");

chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("localhost:8080");

// UNIT test begin

describe("Comments",function(){

    it("should return comment on GET",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/comments/EVENT/5ddba12b1d01120dba5c7b18')
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
      .delete('/comments/EVENT/5ddba12b1d01120dba5c7b18')
      .expect(401)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(401);
        done();
      });
    });
    
  });