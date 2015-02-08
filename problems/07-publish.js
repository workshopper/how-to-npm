var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var datadir = shop.datadir
// verify we're in the right folder
var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

exports.problem = function () {
  if (!shop.cwd())
    return

  reg.run('publish')

  return function () { /*
What good is a package manager without packages?

Not very good.

Luckily, that is not a problem for npm, because it's very easy for all
npm users to publish their modules to share them with the world.

Packages get into theregistry by using the `npm publish` command.

Try it now.  There's not much too it.

(Make sure you're in the right project directory still, though.  If you
publish something by mistake, you can remove it, but there's no guarantee
that no one saw it in the meantime.)
*/}.toString().split('\n').slice(1,-1).join('\n').replace(/%ID%/g, id)
}

exports.verify = function (args, cb) {
  console.log('TODO: make sure that the publish worked')
}
