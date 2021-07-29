# Express List Endpoints

[![Build Status](https://travis-ci.org/AlbertoFdzM/express-list-endpoints.svg?branch=master)](https://travis-ci.org/AlbertoFdzM/express-list-endpoints) [![codecov.io](https://codecov.io/github/AlbertoFdzM/express-list-endpoints/coverage.svg?branch=master)](https://codecov.io/github/AlbertoFdzM/express-list-endpoints?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/de84aedb98256b62c3ef/maintainability)](https://codeclimate.com/github/AlbertoFdzM/express-list-endpoints/maintainability)

[![NPM](https://nodei.co/npm/express-list-endpoints.png)](https://nodei.co/npm/express-list-endpoints/)

Express endpoint parser to retrieve a list of the passed router with the set verbs.

## Example of use

```javascript
const listEndpoints = require('express-list-endpoints')

let app = require('express')();

app.route('/')
  .all(function namedMiddleware(req, res) {
    // Handle request
  })
  .get(function(req, res) {
    // Handle request
  })
  .post(function(req, res) {
    // Handle request
  });

app.route('/about')
  .get(function(req, res) {
    // Handle request
  });

console.log(listEndpoints(app));

/* It omits the 'all' verbs.
[{
    path: '/',
    methods: ['GET', 'POST'],
    middlewares: ['namedMiddleware', 'anonymous', 'anonymous']
  },
  {
    path: '/about',
    methods: ['GET'],
    middlewares: ['anonymous']
}]
*/
```

## Arguments

### `app` - Express `app` or `router` instance

Your router instance (`router`) or your app instance (`app`).

_**Note:** Pay attention that before call this script the router or app must have the endpoints registered due to detect them._

## license

MIT
