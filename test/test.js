var chai = require('chai');
var listEndpoints = require('../index');
var express = require('express');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var router1 = express.Router()

router1.route('/')
  .get(function(req, res) {
    res.end();
  });

describe('express-list-endpoints', function () {
  describe('when called over a router', function () {
    var endpoints = listEndpoints(router1.stack);

    describe('should retrieve an array', function () {
      endpoints.should.not.be.empty;
      endpoints.should.be.an('array');
      endpoints.should.have.length(1);

      it('of objects', function () {
        endpoints.forEach(function (endpoint) {
          endpoint.should.not.be.empty;
          endpoint.should.be.an('object');
        });
      });

      describe('with the router endpoints', function () {
        endpoints.forEach(function (endpoint) {
          endpoint.path.should.not.be.empty;
          endpoint.path.should.be.a('string');

          it('cointaining the slashs', function () {
            endpoint.path.should.contains('/');
          });
        });
      });
    });
  });
});
