/**
 * Print in console all the verbs detected for the passed route
 */
var getRouteMethods = function(route, options) {
  var methods = [];
  options = options || {};

  for (var method in route.methods) {
    if (!options.withAll && method === '_all') {continue;}

    methods.push(method.toUpperCase());
  }

  return methods;
};

/**
 * Return an array if strings with all the detected endpoints
 */
var getEndpoints = function(app, path, endpoints) {
  var regExp = /^\/\^\\\/(?:((?:\w|\\\.|-)*)|(\(\?:\(\[\^\\\/\]\+\?\)\)))\\\/.*/;
  var stack = app.stack || app._router && app._router.stack;

  endpoints = endpoints || [];
  path = path || '';

  stack.forEach(function(val) {
    var newPath = regExp.exec(val.regexp);

    if (val.route) {
      endpoints.push({
        path: path + val.route.path,
        methods: getRouteMethods(val.route, {prefix: path})
      });

    } else if (val.name === 'router' || val.name === 'bound dispatch') {
      if (newPath) {
        getEndpoints(val.handle, path + '/' + newPath[1], endpoints);

      } else {
        getEndpoints(val.handle, path, endpoints);
      }
    }
  });

  return endpoints;
};

module.exports = getEndpoints;
