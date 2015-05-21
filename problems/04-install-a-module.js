var reg = require('../lib/registry.js')
var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  reg.run("install-a-module")

  return function () { /*
The first thing that most people do with npm is install a dependency.

Dependencies are fetched from the registry, and unpacked in the `node_modules`
folder.

To install a module, use the `npm install <modulename>` command.

The registry that we're using for this tutorial is a tiny version of
the one at https://registry.npmjs.org.  So you might find that it only has
a small number of things.

Let's start out by installing the "@linclark/pkg" module.

Run `$ADVENTURE_COMMAND verify` once you're done.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm install @linclark/pkg'

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd)
    return cb(false)

  try {
    var pkg = require(cwd + '/node_modules/@linclark/pkg')
  } catch (er) {
    console.log('Uh oh!  Looks like it didn\'t install right.\n'+
                'The error I got was: \n' +
                (er.stack || er.message) + '\n' +
                'Make sure you use the `npm install @linclark/pkg` command\n' +
                'to install the `@linclark/pkg` module.')
    return cb(false)
  }

  console.log('Congratulations! You installed it.')
  reg.kill()

  return cb(true)
}
