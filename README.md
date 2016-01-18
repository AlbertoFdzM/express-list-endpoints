# Express List Endpoints

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

## license

MIT
