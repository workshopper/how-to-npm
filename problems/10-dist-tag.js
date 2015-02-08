var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var datadir = shop.datadir
// verify we're in the right folder
var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

exports.problem = function () {
  return function () { /*
Every published package on npm has a `dist-tags` entry on it which
maps strings like "latest" to version numbers like "1.2.48".

By default, the "latest" version is what gets installed.  When you
publish, the version that you publish gets tagged as "latest".  This
is generally great, because most of the time you publish things when
you're ready for users to use them.

However, if you need to publish something, and *not* make it the
default version of a package (for example, if it's a security release
for a legacy version, or something), then you can manually manage
these distribution tags with the `dist-tag` function.

Run `npm help dist-tag` to learn more about it.

Try changing the dist-tag on your package.
*/}.toString().split('\n').slice(1,-1).join('\n').replace(/%ID%/g, id)
}

exports.verify = function (args, cb) {
  console.log('TODO: make sure that the dist-tag worked.')
  console.log('probably need to publish another version, I guess?')
}
