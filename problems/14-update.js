var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  reg.run('update')

  return function () { /*
It's fine, of course, to explicitly check for outdated modules,
and then run `npm install` to pull them in.

However, if you want to be a bit more lazy about it, there's a special
npm command that will UPDATE all of your deps to the max version you
allow in your package.json.

Can you guess what command that might be?  (`npm help` might help you)

Update all your deps to the latest version possible, and then
run `how-to-npm verify` to pick up your delicious green banner.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm install @linclark/pkg'

exports.verify = function (args, cb) {
  if (!shop.cwd())
    return cb(false)

  var pkg = require(shop.cwd() + '/node_modules/@linclark/pkg/package.json')
  if (pkg.version !== '1.0.3') {
    console.log('Oops!  You are still using the outdated version!')
    return cb(false)
  }

  reg.kill()
  console.log('Awesome!  You\'re up to date!\n' +
              'Run `how-to-npm` to move on to the next exercise')
  return cb(true)
}
