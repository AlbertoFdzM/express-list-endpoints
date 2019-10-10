/* eslint-env mocha */
var chai = require('chai')
var listEndpoints = require('../src/index')
var express = require('express')
var expect = chai.expect

chai.should()

function checkResults (endpoints) {
  describe('should retrieve an array', function () {
    // eslint-disable-next-line no-unused-expressions
    endpoints.should.not.be.empty
    endpoints.should.be.an('array')
    endpoints.should.have.length(2)

    it('of objects', function () {
      endpoints.forEach(function (endpoint) {
        // eslint-disable-next-line no-unused-expressions
        endpoint.should.not.be.empty
        endpoint.should.be.an('object')
      })
    })

    describe('with the app endpoints', function () {
      endpoints.forEach(function (endpoint) {
        describe('containing', function () {
          describe('the path', function () {
            it('as a string', function () {
              // eslint-disable-next-line no-unused-expressions
              endpoint.path.should.not.be.empty
              endpoint.path.should.be.a('string')
            })

            it('with the slashs', function () {
              endpoint.path.should.contains('/')
            })
          })

          describe('the methods', function () {
            it('as an array', function () {
              // eslint-disable-next-line no-unused-expressions
              endpoint.methods.should.not.be.empty
              endpoint.methods.should.be.an('array')
            })

            endpoint.methods.forEach(function (method) {
              it('of strings', function () {
                // eslint-disable-next-line no-unused-expressions
                method.should.not.be.empty
                method.should.be.a('string')
              })

              it('in uppercase', function () {
                expect(method).to.be.equal(method.toUpperCase())
              })

              it('excluding the _all ones', function () {
                expect(method).to.not.be.equal('_ALL')
              })
            })
          })
        })
      })
    })
  })
}

describe('express-list-endpoints', function () {
  describe('when called over an app', function () {
    var app = express()

    app.route('/')
      .get(function (req, res) {
        res.end()
      })
      .all(function (req, res) {
        res.end()
      })
      .post(function (req, res) {
        res.end()
      })

    app.route('/testing')
      .all(function (req, res) {
        res.end()
      })
      .delete(function (req, res) {
        res.end()
      })

    checkResults(listEndpoints(app))
  })

  describe('when called over a router', function () {
    var router = express.Router()

    router.route('/')
      .get(function (req, res) {
        res.end()
      })
      .all(function (req, res) {
        res.end()
      })
      .post(function (req, res) {
        res.end()
      })

    router.route('/testing')
      .all(function (req, res) {
        res.end()
      })
      .delete(function (req, res) {
        res.end()
      })

    checkResults(listEndpoints(router))
  })

  describe('when called over an app with mounted routers', function () {
    var app = express()
    var router = express.Router()

    app.route('/testing')
      .all(function (req, res) {
        res.end()
      })
      .delete(function (req, res) {
        res.end()
      })

    router.route('/')
      .get(function (req, res) {
        res.end()
      })
      .all(function (req, res) {
        res.end()
      })
      .post(function (req, res) {
        res.end()
      })

    app.use('/router', router)

    checkResults(listEndpoints(app))

    describe('and some of the routers has the option `mergeParams`', function () {
      var app = express()
      var router = express.Router({ mergeParams: true })
      var endpoints

      router.get('/:id/friends', function (req, res) {
        res.end()
      })

      app.use('/router', router)

      endpoints = listEndpoints(app)

      it('should parse the endpoints corretly', function () {
        expect(endpoints).to.have.length(1)
        expect(endpoints[0].path).to.be.equal('/router/:id/friends')
      })

      describe('and also has a sub-router on the router', function () {
        var app = express()
        var router = express.Router({ mergeParams: true })
        var subRouter = express.Router()
        var endpoints

        subRouter.get('/', function (req, res) {
          res.end()
        })

        app.use('/router', router)

        router.use('/:postId/sub-router', subRouter)
        router.use('/:postId([0-9]+)/sub-router2', subRouter)

        endpoints = listEndpoints(app)

        it('should parse the endpoints corretly', function () {
          expect(endpoints).to.have.length(2)
          expect(endpoints[0].path).to.be.equal('/router/:postId/sub-router')
          expect(endpoints[1].path).to.be.equal('/router/:postId/sub-router2')
        })
      })
    })
  })

  describe('when the defined routes', function () {
    describe('contains underscores', function () {
      var router = express.Router()
      var endpoints

      router.get('/some_route', function (req, res) {
        res.end()
      })

      router.get('/some_other_router', function (req, res) {
        res.end()
      })

      router.get('/__last_route__', function (req, res) {
        res.end()
      })

      endpoints = listEndpoints(router)

      it('should parse the endpoint corretly', function () {
        endpoints[0].path.should.be.equal('/some_route')
        endpoints[1].path.should.be.equal('/some_other_router')
        endpoints[2].path.should.be.equal('/__last_route__')
      })
    })

    describe('contains hyphens', function () {
      var router = express.Router()
      var endpoints

      router.get('/some-route', function (req, res) {
        res.end()
      })

      router.get('/some-other-router', function (req, res) {
        res.end()
      })

      router.get('/--last-route--', function (req, res) {
        res.end()
      })

      endpoints = listEndpoints(router)

      it('should parse the endpoint corretly', function () {
        endpoints[0].path.should.be.equal('/some-route')
        endpoints[1].path.should.be.equal('/some-other-router')
        endpoints[2].path.should.be.equal('/--last-route--')
      })
    })

    describe('contains dots', function () {
      var router = express.Router()
      var endpoints

      router.get('/some.route', function (req, res) {
        res.end()
      })

      router.get('/some.other.router', function (req, res) {
        res.end()
      })

      router.get('/..last.route..', function (req, res) {
        res.end()
      })

      endpoints = listEndpoints(router)

      it('should parse the endpoint corretly', function () {
        endpoints[0].path.should.be.equal('/some.route')
        endpoints[1].path.should.be.equal('/some.other.router')
        endpoints[2].path.should.be.equal('/..last.route..')
      })
    })

    describe('contains multiple different chars', function () {
      var router = express.Router()
      var endpoints

      router.get('/s0m3_r.oute', function (req, res) {
        res.end()
      })

      router.get('/v1.0.0', function (req, res) {
        res.end()
      })

      router.get('/not_sure.what-1m.d01ng', function (req, res) {
        res.end()
      })

      endpoints = listEndpoints(router)

      it('should parse the endpoint corretly', function () {
        endpoints[0].path.should.be.equal('/s0m3_r.oute')
        endpoints[1].path.should.be.equal('/v1.0.0')
        endpoints[2].path.should.be.equal('/not_sure.what-1m.d01ng')
      })
    })
  })

  describe('when called over a mounted router with only root path', function () {
    var endpoints
    var app = express()
    var router = express.Router()

    router.get('/', function (req, res) {
      res.end()
    })

    app.use('/', router)

    endpoints = listEndpoints(app)

    it('should retrieve the list of endpoints and its methods', function () {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0]).to.have.own.property('path')
      expect(endpoints[0]).to.have.own.property('methods')
      expect(endpoints[0].path).to.be.equal('/')
      expect(endpoints[0].methods[0]).to.be.equal('GET')
    })
  })

  describe('when called over a multi-level base route', function () {
    var endpoints
    var app = express()
    var router = express.Router()

    router.get('/my/path', function (req, res) {
      res.end()
    })

    app.use('/multi/level', router)
    app.use('/super/duper/multi/level', router)

    endpoints = listEndpoints(app)

    it('should retrieve the correct built path', function () {
      expect(endpoints).to.have.length(2)
      expect(endpoints[0].path).to.be.equal('/multi/level/my/path')
      expect(endpoints[1].path).to.be.equal('/super/duper/multi/level/my/path')
    })

    describe('with params', function () {
      var endpoints
      var app = express()
      var router = express.Router()

      router.get('/users/:id', function (req, res) {
        res.end()
      })

      router.get('/super/users/:id', function (req, res) {
        res.end()
      })

      app.use('/multi/:multiId/level/:levelId', router)

      endpoints = listEndpoints(app)

      it('should retrieve the correct built path', function () {
        expect(endpoints).to.have.length(2)
        expect(endpoints[0].path).to.be.equal('/multi/:multiId/level/:levelId/users/:id')
        expect(endpoints[1].path).to.be.equal('/multi/:multiId/level/:levelId/super/users/:id')
      })
    })

    describe('with params in middle of the pattern', function () {
      var endpoints
      var app = express()
      var router = express.Router()

      router.get('/super/users/:id/friends', function (req, res) {
        res.end()
      })

      app.use('/multi/level', router)

      endpoints = listEndpoints(app)

      it('should retrieve the correct built path', function () {
        expect(endpoints).to.have.length(1)
        expect(endpoints[0].path).to.be.equal('/multi/level/super/users/:id/friends')
      })
    })
  })

  describe('when called over a route with params', function () {
    var endpoints
    var app = express()

    app.get('/users/:id', function (req, res) {
      res.end()
    })

    endpoints = listEndpoints(app)

    it('should retrieve the correct built path', function () {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].path).to.be.equal('/users/:id')
    })
  })

  describe('when called over a route with params in middle of the pattern', function () {
    var endpoints
    var app = express()

    app.get('/users/:id/friends', function (req, res) {
      res.end()
    })

    endpoints = listEndpoints(app)

    it('should retrieve the correct built path', function () {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].path).to.be.equal('/users/:id/friends')
    })
  })

  describe('when called over a route with multiple methods with "/" path defined', () => {
    var endpoints
    var router = express.Router()

    router
      .post('/test', function (req, res) {
        res.end()
      })
      .delete('/test', function (req, res) {
        res.end()
      })

    endpoints = listEndpoints(router)

    it('should retrieve the correct built path', function () {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].path).to.be.equal('/test')
      expect(endpoints[0].methods[0]).to.be.equal('POST')
    })

    it('should retrieve the correct built methods', function () {
      expect(endpoints[0].methods).to.have.length(2)
      expect(endpoints[0].methods[0]).to.be.equal('POST')
      expect(endpoints[0].methods[1]).to.be.equal('DELETE')
    })
  })
})
