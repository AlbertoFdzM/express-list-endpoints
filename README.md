# Express List Endpoints

[![Build Status](https://travis-ci.org/AlbertoFdzM/express-list-endpoints.svg?branch=master)](https://travis-ci.org/AlbertoFdzM/express-list-endpoints) [![codecov.io](https://codecov.io/github/AlbertoFdzM/express-list-endpoints/coverage.svg?branch=master)](https://codecov.io/github/AlbertoFdzM/express-list-endpoints?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/AlbertoFdzM/express-list-endpoints/badges/score.svg)](https://www.bithound.io/github/AlbertoFdzM/express-list-endpoints)

[![NPM](https://nodei.co/npm/express-list-endpoints.png)](https://nodei.co/npm/express-list-endpoints/)

Express endpoint parser to retrieve a list of the passed router with the set verbs.

## Example of use

```javascript
router.route('/')
  .all(function(req, res) {
    // Handle request
  })
  .get(function(req, res) {
    // Handle request
  })
  .post(function(req, res) {
    // Handle request
  });

router.route('/about')
  .get(function(req, res) {
    // Handle request
  });

console.log(listEndpoints(router.stack));
/* It omits the 'all' verbs.
[{
    path: '/',
    methods: ['GET', 'POST']
  },
  {
    path: '/about',
    methods: ['GET']
}]
*/
```

## Arguments

### `app` or `router` instance

Your router instance (`router`) or your app instance (`app`).

_**Note:** Pay attention that before call this script the router or app must have the endpoints registered due to detect them._

## license

MIT
