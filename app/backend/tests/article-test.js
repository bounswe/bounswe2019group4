var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var supertest = require("supertest");

chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("localhost:8080");

// UNIT test begin


describe("Articles",function(){

    it("should list articles on GET",function(done){
      this.timeout(30000) // all tests in this suite get 30 seconds before timeout
      server
      .get('/articles')
      .query({"limit":10, "page":1})
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
      .delete('/articles/123132')
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
      .delete('/articles/123132')
      .send({
        "text": "EUR/USD holds up above 1.14 amid trade hopes, amid upbeat ZEW data",
        "title": "EUR/USD is trading above 1.14, holding up. The US will probably refrain from slapping tariffs on European cars. The German ZEW Economic Sentiment beat expectations with -2.1."
      })
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
      .patch('/articles/123132')
      .expect(400)
      .end(function(err,res){
          should.equal(err, null);
          res.should.have.status(400);
        done();
      });
    });
  });
  