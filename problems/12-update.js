var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var datadir = shop.datadir
// verify we're in the right folder
var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

exports.problem = function () {
  reg.run('update')

  return function () { /*
It's fine, of course, to explicitly check for outdated modules,
and then run `npm install` to pull them in.

However, if you want to be a bit more lazy about it, there's a special
npm command that will UPDATE all of your deps to the max version you
allow in your package.json.

Can you guess what command that might be?

Update all your deps to the latest version possible, and then
run `how-to-npm verify` to pick up your delicious green banner.
*/}.toString().split('\n').slice(1,-1).join('\n').replace(/%ID%/g, id)
}

exports.verify = function (args, cb) {
  console.log('TODO: make sure that the publish worked')
}
