var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  return function () { /*
If you have a way to put stuff there, then naturally, you'll one
day need a way to delete them.

Enter the `npm rm` command (aka `npm uninstall` if you prefer to
type things out long-hand).

Remove all the deps!  But, make sure that you don't keep depending on them.

Just like you can use `--save` on installing packages, you can also
use `--save` when removing packages, to also remove them from your
package.json file.

When you've removed your dependencies, type `how-to-npm verify` to move on.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm rm @linclark/pkg --save'

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd)
    return cb(false)

  var pkg = require(cwd + '/package.json')
  var deps = Object.keys(pkg.dependencies || {})
  var nm
  try {
    var nm = fs.readdirSync(path.resolve(cwd, 'node_modules'))
    nm = nm.filter(function (n) {
      return !/^\./.test(n)
    })
  } catch (er) {
    nm = []
  }

  if (nm.length) {
    console.log('Looks like there are some deps still hanging around')
    return cb(false)
  }

  if (deps.length) {
    console.log('You removed the files, but not the entries in package.json')
    return cb(false)
  }

  console.log(function () {/*
Awesome!  You have removed the packages from your node_modules folder,
and also updated your package.json file to reflect that you're no longer
depending on them.

Well done.
*/}.toString().split('\n').slice(1,-1).join('\n'))
  return cb(true)
}
