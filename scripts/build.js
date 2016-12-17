var fs = require('fs')
var path = require('path')
var pkgInfo = require('../package.json')

var changelog = path.join(__dirname, '../CHANGELOG.md')

fs.readFile(changelog, 'utf8', function (err, data) {
  if (err) return console.err(err)

  var version = 'v' + pkgInfo.version
  var date = new Date().toISOString().replace(/T.*/, '')

  var result = data.replace(/\[UNRELEASED]/g, version + ' - ' + date)

  fs.writeFile(changelog, result, 'utf8', function (err) {
    if (err) return console.err(err)
  })
})
