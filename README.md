# Express List Endpoints

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/AlbertoFdzM/express-list-endpoints/ci.yml?branch=main&logo=github)](https://github.com/AlbertoFdzM/express-list-endpoints/actions/workflows/ci.yml?query=branch%3Amain) [![Codecov Coverage Report](https://img.shields.io/codecov/c/github/AlbertoFdzM/express-list-endpoints/main)](https://codecov.io/github/AlbertoFdzM/express-list-endpoints?branch=main) [![Code Climate Maintainability Report](https://img.shields.io/codeclimate/maintainability/AlbertoFdzM/express-list-endpoints)](https://codeclimate.com/github/AlbertoFdzM/express-list-endpoints/maintainability) [![NPM Downloads](https://img.shields.io/npm/dm/express-list-endpoints)
](https://www.npmjs.com/package/express-list-endpoints) [![NPM License](https://img.shields.io/npm/l/express-list-endpoints)](https://www.npmjs.com/package/express-list-endpoints)

[![NPM Package Page](https://img.shields.io/badge/express--list--endpoints-gray?label=npm&labelColor=c21104)](https://www.npmjs.com/package/express-list-endpoints)

Express endpoint parser to retrieve a list of the passed router with the set verbs.

## Examples of use

```javascript
const express = require('express');
const expressListEndpoints = require('express-list-endpoints');

let app = express();

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

const endpoints = expressListEndpoints(app);

console.log(endpoints);

/* It omits 'all' handlers.
[
  {
    path: '/',
    methods: [ 'GET', 'POST' ],
    middlewares: [ 'namedMiddleware', 'anonymous', 'anonymous' ]
  },
  {
    path: '/about',
    methods: [ 'GET' ],
    middlewares: [ 'anonymous' ]
  }
]
*/
```

```typescript
import express from 'express';
import expressListEndpoints from 'express-list-endpoints';

let app = express();

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

const endpoints = expressListEndpoints(app);

console.log(endpoints);
```

## Arguments

### `app` - Express `app` or `router` instance

Your router instance (`router`) or your app instance (`app`).

_**Note:** Pay attention that before call this script the router or app must have the endpoints registered due to detect them._

## Contributing to express-list-endpoints

### Development

Running test:
```shell
npm test
```

## License

Express List Endpoints is [MIT licensed](./LICENSE).
