var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  reg.run('publish')

  return function () { /*
Publishing something once is fine.  But healthy packages get
published again and again with new and exciting bug fixes.

You can't re-use the same version number again, because that's hella
confusing.  But, now that we changed the version number in the last
exercise, you can publish the package again.

Go for it!
*/}.toString().split('\n').slice(1,-1).join('\n')
}

exports.verify = function (args, cb) {
  console.log('TODO: make sure that the publish worked')
}
