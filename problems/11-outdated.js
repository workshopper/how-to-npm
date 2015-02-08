var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  reg.run('outdated')

  return function () { /*
Now that we have some dependencies, and you've learned that your own
packages can be updated repeatedly, the obvious question is: What do
we do when someone *else* updates *their* package?

The first step is to detect this.  Because of the way that we define
our dependencies with a version range, and each release is a unique
combination of a name and a version, we can detect compatible releases
programmatically with the `npm outdated` command.

...
*/}.toString().split('\n').slice(1,-1).join('\n')
}

exports.verify = function (args, cb) {
  console.log('TODO: find some outdated stuff')
}
