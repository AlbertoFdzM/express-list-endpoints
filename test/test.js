var chai = require('chai');
var listEndpoints = require('../index');
var express = require('express');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var router1 = express.Router();

router1.route('/')
  .get(function(req, res) {
    res.end();
  })
  .all(function(req, res) {
    res.end();
  })
  .post(function(req, res) {
    res.end();
  });

router1.route('/testing')
  .all(function(req, res) {
    res.end();
  })
  .delete(function(req, res) {
    res.end();
  });

describe('express-list-endpoints', function() {
  describe('when called over a router', function() {
    var endpoints = listEndpoints(router1.stack);

    describe('should retrieve an array', function() {
      endpoints.should.not.be.empty;
      endpoints.should.be.an('array');
      endpoints.should.have.length(2);

      it('of objects', function() {
        endpoints.forEach(function(endpoint) {
          endpoint.should.not.be.empty;
          endpoint.should.be.an('object');
        });
      });

      describe('with the router endpoints', function() {
        endpoints.forEach(function(endpoint) {

          describe('containing', function() {

            describe('the path', function() {
              it('as a string', function() {
                endpoint.path.should.not.be.empty;
                endpoint.path.should.be.a('string');
              });

              it('with the slashs', function() {
                endpoint.path.should.contains('/');
              });
            });

            describe('the methods', function() {
              it('as an array', function() {
                endpoint.methods.should.not.be.empty;
                endpoint.methods.should.be.an('array');
              });

              endpoint.methods.forEach(function(method) {
                it('of strings', function() {
                  method.should.not.be.empty;
                  method.should.be.a('string');
                });

                it('in uppercase', function() {
                  expect(method).to.be.equal(method.toUpperCase());
                });

                it('excluding the _all ones', function() {
                  expect(method).to.not.be.equal('_ALL');
                });
              });
            });
          });
        });
      });
    });
  });
});
