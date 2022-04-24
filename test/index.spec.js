/* eslint-env mocha */
const mocha = require('mocha')
const chai = require('chai')
const listEndpoints = require('../src/index')
const express = require('express')

const before = mocha.before
const expect = chai.expect

chai.should()

function checkResults (endpoints) {
  describe('should retrieve an array', () => {
    endpoints.should.be.an('array')
    endpoints.should.have.length(3)

    it('of objects', () => {
      endpoints.forEach((endpoint) => {
        endpoint.should.be.an('object')
      })
    })

    describe('with the app endpoints', () => {
      endpoints.forEach((endpoint) => {
        describe('containing', () => {
          describe('the path', () => {
            it('as a string', () => {
              endpoint.path.should.be.a('string')
            })

            it('with the slashes', () => {
              endpoint.path.should.contains('/')
            })
          })

          describe('the method', () => {
            const {method} = endpoint

            it('is a string', () => {
              method.should.be.a('string')
            })

            it('in uppercase', () => {
              expect(method).to.be.equal(method.toUpperCase())
            })

            it('excluding the _all ones', () => {
              expect(method).to.not.be.equal('_ALL')
            })
          })

          describe('the middlewares', () => {
            it('as an array', () => {
              endpoint.middlewares.should.be.an('array')
            })

            endpoint.middlewares.forEach((middleware) => {
              it('of strings', () => {
                middleware.should.be.a('string')
              })
            })
          })
        })
      })
    })
  })
}

describe('express-list-endpoints', () => {
  describe('when called over an app', () => {
    let endpoints

    before(() => {
      const app = express()

      app.route('/')
        .get((req, res) => {
          res.end()
        })
        .all((req, res) => {
          res.end()
        })
        .post((req, res) => {
          res.end()
        })

      app.route('/testing')
        .all((req, res) => {
          res.end()
        })
        .delete((req, res) => {
          res.end()
        })

      endpoints = listEndpoints(app)
    })

    it('', () => {
      checkResults(endpoints)
    })
  })

  describe('when called over a router', () => {
    let endpoints

    before(() => {
      const router = express.Router()

      router.route('/')
        .get((req, res) => {
          res.end()
        })
        .all((req, res) => {
          res.end()
        })
        .post((req, res) => {
          res.end()
        })

      router.route('/testing')
        .all((req, res) => {
          res.end()
        })
        .delete((req, res) => {
          res.end()
        })

      endpoints = listEndpoints(router)
    })

    it('', () => {
      checkResults(endpoints)
    })
  })

  describe('when called over an app with mounted routers', () => {
    let endpoints

    before(() => {
      const app = express()
      const router = express.Router()

      app.route('/testing')
        .all((req, res) => {
          res.end()
        })
        .delete((req, res) => {
          res.end()
        })

      router.route('/')
        .get((req, res) => {
          res.end()
        })
        .all((req, res) => {
          res.end()
        })
        .post((req, res) => {
          res.end()
        })

      app.use('/router', router)

      endpoints = listEndpoints(app)
    })

    it('', () => {
      checkResults(endpoints)
    })

    describe('and some of the routers has the option `mergeParams`', () => {
      let endpoints

      before(() => {
        const app = express()
        const router = express.Router({ mergeParams: true })

        router.get('/:id/friends', (req, res) => {
          res.end()
        })

        app.use('/router', router)

        endpoints = listEndpoints(app)
      })

      it('should parse the endpoints correctly', () => {
        expect(endpoints).to.have.length(1)
        expect(endpoints[0].path).to.be.equal('/router/:id/friends')
      })

      describe('and also has a sub-router on the router', () => {
        let endpoints

        before(() => {
          const app = express()
          const router = express.Router({ mergeParams: true })
          const subRouter = express.Router()

          subRouter.get('/', (req, res) => {
            res.end()
          })

          app.use('/router', router)

          router.use('/:postId/sub-router', subRouter)

          endpoints = listEndpoints(app)
        })

        it('should parse the endpoints correctly', () => {
          expect(endpoints).to.have.length(1)
          expect(endpoints[0].path).to.be.equal('/router/:postId/sub-router')
        })
      })
    })
  })

  describe('when the defined routes', () => {
    describe('contains underscores', () => {
      let endpoints

      before(() => {
        const router = express.Router()

        router.get('/some_route', (req, res) => {
          res.end()
        })

        router.get('/some_other_router', (req, res) => {
          res.end()
        })

        router.get('/__last_route__', (req, res) => {
          res.end()
        })

        endpoints = listEndpoints(router)
      })

      it('should parse the endpoint correctly', () => {
        endpoints[0].path.should.be.equal('/some_route')
        endpoints[1].path.should.be.equal('/some_other_router')
        endpoints[2].path.should.be.equal('/__last_route__')
      })
    })

    describe('contains hyphens', () => {
      let endpoints

      before(() => {
        const router = express.Router()

        router.get('/some-route', (req, res) => {
          res.end()
        })

        router.get('/some-other-router', (req, res) => {
          res.end()
        })

        router.get('/--last-route--', (req, res) => {
          res.end()
        })

        endpoints = listEndpoints(router)
      })

      it('should parse the endpoint correctly', () => {
        endpoints[0].path.should.be.equal('/some-route')
        endpoints[1].path.should.be.equal('/some-other-router')
        endpoints[2].path.should.be.equal('/--last-route--')
      })
    })

    describe('contains dots', () => {
      let endpoints

      before(() => {
        const router = express.Router()

        router.get('/some.route', (req, res) => {
          res.end()
        })

        router.get('/some.other.router', (req, res) => {
          res.end()
        })

        router.get('/..last.route..', (req, res) => {
          res.end()
        })

        endpoints = listEndpoints(router)
      })

      it('should parse the endpoint correctly', () => {
        endpoints[0].path.should.be.equal('/some.route')
        endpoints[1].path.should.be.equal('/some.other.router')
        endpoints[2].path.should.be.equal('/..last.route..')
      })
    })

    describe('contains multiple different chars', () => {
      let endpoints

      before(() => {
        const router = express.Router()

        router.get('/s0m3_r.oute', (req, res) => {
          res.end()
        })

        router.get('/v1.0.0', (req, res) => {
          res.end()
        })

        router.get('/not_sure.what-1m.d01ng', (req, res) => {
          res.end()
        })

        endpoints = listEndpoints(router)
      })

      it('should parse the endpoint correctly', () => {
        endpoints[0].path.should.be.equal('/s0m3_r.oute')
        endpoints[1].path.should.be.equal('/v1.0.0')
        endpoints[2].path.should.be.equal('/not_sure.what-1m.d01ng')
      })
    })
  })

  describe('when called over a mounted router with only root path', () => {
    let endpoints

    before(() => {
      const app = express()
      const router = express.Router()

      router.get('/', (req, res) => {
        res.end()
      })

      app.use('/', router)

      endpoints = listEndpoints(app)
    })

    it('should retrieve the list of endpoints and its methods', () => {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0]).to.have.own.property('path')
      expect(endpoints[0]).to.have.own.property('method')
      expect(endpoints[0].path).to.be.equal('/')
      expect(endpoints[0].method).to.be.equal('GET')
    })
  })

  describe('when called over a multi-level base route', () => {
    let endpoints

    before(() => {
      const app = express()
      const router = express.Router()

      router.get('/my/path', (req, res) => {
        res.end()
      })

      app.use('/multi/level', router)
      app.use('/super/duper/multi/level', router)

      endpoints = listEndpoints(app)
    })

    it('should retrieve the correct built path', () => {
      expect(endpoints).to.have.length(2)
      expect(endpoints[0].path).to.be.equal('/multi/level/my/path')
      expect(endpoints[1].path).to.be.equal('/super/duper/multi/level/my/path')
    })

    describe('with params', () => {
      let endpoints

      before(() => {
        const app = express()
        const router = express.Router()

        router.get('/users/:id', (req, res) => {
          res.end()
        })

        router.get('/super/users/:id', (req, res) => {
          res.end()
        })

        app.use('/multi/:multiId/level/:levelId', router)

        endpoints = listEndpoints(app)
      })

      it('should retrieve the correct built path', () => {
        expect(endpoints).to.have.length(2)
        expect(endpoints[0].path).to.be.equal('/multi/:multiId/level/:levelId/users/:id')
        expect(endpoints[1].path).to.be.equal('/multi/:multiId/level/:levelId/super/users/:id')
      })
    })

    describe('with params in middle of the pattern', () => {
      let endpoints

      before(() => {
        const app = express()
        const router = express.Router()

        router.get('/super/users/:id/friends', (req, res) => {
          res.end()
        })

        app.use('/multi/level', router)

        endpoints = listEndpoints(app)
      })

      it('should retrieve the correct built path', () => {
        expect(endpoints).to.have.length(1)
        expect(endpoints[0].path).to.be.equal('/multi/level/super/users/:id/friends')
      })
    })
  })

  describe('when called over a route with params', () => {
    let endpoints

    before(() => {
      const app = express()

      app.get('/users/:id', (req, res) => {
        res.end()
      })

      endpoints = listEndpoints(app)
    })

    it('should retrieve the correct built path', () => {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].path).to.be.equal('/users/:id')
    })
  })

  describe('when called over a route with params in middle of the pattern', () => {
    let endpoints

    before(() => {
      const app = express()

      app.get('/users/:id/friends', (req, res) => {
        res.end()
      })

      endpoints = listEndpoints(app)
    })

    it('should retrieve the correct built path', () => {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].path).to.be.equal('/users/:id/friends')
    })
  })

  describe('when called over a route with multiple methods with "/" path defined', () => {
    let endpoints

    before(() => {
      const router = express.Router()

      router
        .post('/test', (req, res) => {
          res.end()
        })
        .delete('/test', (req, res) => {
          res.end()
        })

      endpoints = listEndpoints(router)
    })

    it('should retrieve the correct built path', () => {
      expect(endpoints).to.have.length(2)
      expect(endpoints[0].path).to.be.equal('/test')
      expect(endpoints[1].path).to.be.equal('/test')
    })

    it('should retrieve the correct built methods', () => {
      expect(endpoints[0].method).to.be.equal('POST')
      expect(endpoints[1].method).to.be.equal('DELETE')
    })
  })

  describe('when called with middlewares', () => {
    let endpoints

    before(() => {
      const router = express.Router()

      const exampleMiddleware = () => {}

      router
        .post('/test', [
          exampleMiddleware,
          () => {} // Anonymous middleware
        ])

      endpoints = listEndpoints(router)
    })

    it('should retrieve the correct built path', () => {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].path).to.be.equal('/test')
      expect(endpoints[0].method).to.be.equal('POST')
    })

    it('should retrieve the correct middlewares', () => {
      expect(endpoints).to.have.length(1)
      expect(endpoints[0].middlewares).to.have.length(2)
      expect(endpoints[0].middlewares[0]).to.equal('exampleMiddleware')
      expect(endpoints[0].middlewares[1]).to.equal('anonymous')
    })
  })

  describe('when called with an array of paths', () => {
    let endpoints

    before(() => {
      const app = express()
      const router = express.Router()

      app.get([
        '/one',
        '/two'
      ], (req, res) => {
        res.end()
      })

      router.get([
        '/one',
        '/two'
      ], (req, res) => {
        res.end()
      })

      app.use([
        '/router',
        '/sub-path'
      ], router)

      endpoints = listEndpoints(app)
    })

    it('should list routes correctly', () => {
      expect(endpoints).to.have.length(4)
      expect(endpoints[0].path).to.be.equal('/one')
      expect(endpoints[0].method).to.be.equal('GET')
      expect(endpoints[1].path).to.be.equal('/two')
      expect(endpoints[1].method).to.be.equal('GET')
    })
  })

  describe('when called with an app with a mounted sub-app', () => {
    let endpoints

    before(() => {
      const app = express()
      const subApp = express()

      app.get('/', (req, res) => {
        res.end()
      })

      subApp.get('/', (req, res) => {
        res.end()
      })

      app.use('/sub-app', subApp)

      endpoints = listEndpoints(app)
    })

    it('should list routes correctly', () => {
      expect(endpoints).to.have.length(2)
      expect(endpoints[0].path).to.be.equal('/')
      expect(endpoints[0].method).to.be.equal('GET')
      expect(endpoints[0].middlewares[0]).to.be.equal('anonymous')
      expect(endpoints[1].path).to.be.equal('/sub-app')
      expect(endpoints[1].method).to.be.null
      expect(endpoints[1].middlewares).to.have.length(0)
    })
  })
})
