var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  // capture the current version in the datadir

  return function () { /*
A discussion of SemVer.

Use the `npm version` command to update your package version.

Do this for each change.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

exports.verify = function (args, cb) {
  console.log('TODO: make sure that the version changed')
}
