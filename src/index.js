// var debug = require('debug')('express-list-endpoints')

/**
 * Print in console all the verbs detected for the passed route
 */
var getRouteMethods = function (route) {
  var methods = []

  for (var method in route.methods) {
    if (method === '_all') continue

    methods.push(method.toUpperCase())
  }

  return methods
}

/**
 * Return true if found regexp related with express params
 */
var hasParams = function (value) {
  var regExp = /\(\?:\(\[\^\\\/]\+\?\)\)/g
  return regExp.test(value)
}

/**
 * Return an array of strings with all the detected endpoints
 */
var getEndpoints = function (app, path, endpoints) {
  var regExp = /^\/\^\\\/(?:(:?[\w\\.-]*(?:\\\/:?[\w\\.-]*)*)|(\(\?:\(\[\^\\\/]\+\?\)\)))\\\/.*/
  var stack = app.stack || (app._router && app._router.stack)

  endpoints = endpoints || []
  path = path || ''

  stack.forEach(function (val) {
    if (val.route) {
      endpoints.push({
        path: path + (path && val.route.path === '/' ? '' : val.route.path),
        methods: getRouteMethods(val.route)
      })
    } else if (val.name === 'router' || val.name === 'bound dispatch') {
      var newPath = regExp.exec(val.regexp)

      if (newPath) {
        var parsedRegexp = val.regexp
        var keyIndex = 0
        var parsedPath

        while (hasParams(parsedRegexp)) {
          parsedRegexp = parsedRegexp.toString().replace(/\(\?:\(\[\^\\\/]\+\?\)\)/, ':' + val.keys[keyIndex].name)
          keyIndex++
        }

        if (parsedRegexp !== val.regexp) {
          newPath = regExp.exec(parsedRegexp)
        }

        parsedPath = newPath[1].replace(/\\\//g, '/')

        if (parsedPath === ':postId/sub-router') console.log(val)

        getEndpoints(val.handle, path + '/' + parsedPath, endpoints)
      } else {
        getEndpoints(val.handle, path, endpoints)
      }
    }
  })

  return endpoints
}

module.exports = getEndpoints
