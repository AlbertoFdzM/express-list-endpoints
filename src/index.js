// var debug = require('debug')('express-list-endpoints')
const regexpExpressRegexp = /^\/\^\\\/(?:(:?[\w\\.-]*(?:\\\/:?[\w\\.-]*)*)|(\(\?:\(\[\^\\\/]\+\?\)\)))\\\/.*/
// var arrayPathItemRegexp = /\^[^^$]*\\\/\?\(\?=\\\/\|\$\)\|?/
// var arrayPathsRegexp = /\(\?:((\^[^^$]*\\\/\?\(\?=\\\/\|\$\)\|?)+)\)\/i?/
const expressRootRegexp = '/^\\/?(?=\\/|$)/i'
const regexpExpressParam = /\(\?:\(\[\^\\\/]\+\?\)\)/g

const STACK_ITEM_VALID_NAMES = [
  'router',
  'bound dispatch',
  'mounted_app'
]

/**
 * Returns all the verbs detected for the passed route
 */
const getRouteMethods = function (route) {
  const methods = []

  for (const method in route.methods) {
    if (method === '_all') continue

    methods.push(method.toUpperCase())
  }

  return methods
}

/**
 * Returns the names (or anonymous) of all the middleware attached to the
 * passed route
 */
const getRouteMiddleware = function (route) {
  return route.stack.map(function (item) {
    return item.handle.name || 'anonymous'
  })
}

/**
 * Returns true if found regexp related with express params
 */
const hasParams = function (pathRegexp) {
  return regexpExpressParam.test(pathRegexp)
}

/**
 * @param {Object} route Express route object to be parsed
 * @param {string} basePath The basePath the route is on
 * @return {Object[]} Endpoints info
 */
const parseExpressRoute = function (route, basePath) {
  const endpoints = []

  if (Array.isArray(route.path)) {
    route.path.forEach(function (path) {
      const endpoint = {
        path: basePath + (basePath && path === '/' ? '' : path),
        methods: getRouteMethods(route),
        middleware: getRouteMiddleware(route)
      }

      endpoints.push(endpoint)
    })
  } else {
    const endpoint = {
      path: basePath + (basePath && route.path === '/' ? '' : route.path),
      methods: getRouteMethods(route),
      middleware: getRouteMiddleware(route)
    }

    endpoints.push(endpoint)
  }

  return endpoints
}

const parseExpressPath = function (expressPathRegexp, params) {
  let parsedPath = regexpExpressRegexp.exec(expressPathRegexp)
  let parsedRegexp = expressPathRegexp
  let paramIdx = 0

  while (hasParams(parsedRegexp)) {
    const paramId = ':' + params[paramIdx].name

    parsedRegexp = parsedRegexp
      .toString()
      .replace(/\(\?:\(\[\^\\\/]\+\?\)\)/, paramId)

    paramIdx++
  }

  if (parsedRegexp !== expressPathRegexp) {
    parsedPath = regexpExpressRegexp.exec(parsedRegexp)
  }

  parsedPath = parsedPath[1].replace(/\\\//g, '/')

  return parsedPath
}

const parseEndpoints = function (app, basePath, endpoints) {
  const stack = app.stack || (app._router && app._router.stack)

  endpoints = endpoints || []
  basePath = basePath || ''

  if (!stack) {
    addEndpoints(endpoints, [{
      path: basePath,
      methods: [],
      middlewares: []
    }])
  } else {
    stack.forEach(function (stackItem) {
      if (stackItem.route) {
        const newEndpoints = parseExpressRoute(stackItem.route, basePath)

        endpoints = addEndpoints(endpoints, newEndpoints)
      } else if (STACK_ITEM_VALID_NAMES.indexOf(stackItem.name) > -1) {
        if (regexpExpressRegexp.test(stackItem.regexp)) {
          const parsedPath = parseExpressPath(stackItem.regexp, stackItem.keys)

          parseEndpoints(stackItem.handle, basePath + '/' + parsedPath, endpoints)
        } else if (!stackItem.path && stackItem.regexp && stackItem.regexp.toString() !== expressRootRegexp) {
          const regEcpPath = ' RegExp(' + stackItem.regexp + ') '

          parseEndpoints(stackItem.handle, basePath + '/' + regEcpPath, endpoints)
        } else {
          parseEndpoints(stackItem.handle, basePath, endpoints)
        }
      }
    })
  }

  return endpoints
}

/**
 * Ensures the path of the new endpoints isn't yet in the array.
 * If the path is already in the array merges the endpoints with the existing
 * one, if not, it adds them to the array.
 *
 * @param {Array} endpoints Array of current endpoints
 * @param {Object[]} newEndpoints New endpoints to be added to the array
 * @returns {Array} Updated endpoints array
 */
const addEndpoints = function (endpoints, newEndpoints) {
  newEndpoints.forEach(function (newEndpoint) {
    const foundEndpointIdx = endpoints.findIndex(function (item) {
      return item.path === newEndpoint.path
    })

    if (foundEndpointIdx > -1) {
      const foundEndpoint = endpoints[foundEndpointIdx]

      const newMethods = newEndpoint.methods.filter(function (method) {
        return foundEndpoint.methods.indexOf(method) === -1
      })

      foundEndpoint.methods = foundEndpoint.methods.concat(newMethods)
    } else {
      endpoints.push(newEndpoint)
    }
  })

  return endpoints
}

/**
 * Returns an array of strings with all the detected endpoints
 * @param {Object} app the express/route instance to get the endpoints from
 */
const getEndpoints = function (app) {
  const endpoints = parseEndpoints(app)

  return endpoints
}

module.exports = getEndpoints
