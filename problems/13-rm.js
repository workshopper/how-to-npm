var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var datadir = shop.datadir
// verify we're in the right folder
var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

exports.problem = function () {
  // Capture the set of deps

  return function () { /*
If you have a way to put stuff there, then naturally, you'll one
day need a way to delete them.

Enter the `npm rm` command (aka `npm uninstall` if you prefer to
type tings out long-hand).

Remove one of the deps.

Just like you can use `--save` on installing packages, you can also
use `--save` when removing packages, to also remove them from your
package.json file.

When you've removed a dependency, type `how-to-npm verify` to move on.
*/}.toString().split('\n').slice(1,-1).join('\n').replace(/%ID%/g, id)
}

exports.verify = function (args, cb) {
  console.log('TODO: make sure that the publish worked')
}
