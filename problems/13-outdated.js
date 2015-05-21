var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  // If it hasn't already been done, add a new version of @linclark/pkg.
  var pkg = require(shop.datadir + '/registry/@linclark/pkg/body.json')
  if (pkg['dist-tags'].latest === '1.0.2') {
    // publish an update
    shop.cpr(path.resolve(__dirname, '..', 'lib', 'registry-assets-update'),
             path.resolve(shop.datadir, 'registry'))
  }

  reg.run('outdated')

  return function () { /*
Now that we have some dependencies, and you've learned that your own
packages can be updated repeatedly, the obvious question is: What do
we do when someone *else* updates *their* package?

The first step is to detect this.  Because of the way that we define
our dependencies with a version range, and each release is a unique
combination of a name and a version, we can detect compatible releases
programmatically with the `npm outdated` command.

To pass this challenge, run `how-to-npm verify PKG` where `PKG`
is the name of the package that is out of date.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm outdated; how-to-npm verify @linclark/pkg'

exports.verify = function (args, cb) {
  if (!shop.cwd())
    return cb(false)

  var arg = args.join('').toLowerCase()
  if (arg === '@linclark/pkg') {
    console.log(function () {/*
That's absolutely right!  The `@linclark/pkg` package has had an update while we
weren't looking.

In the next lesson, we'll learn how to update packages that are outdated.
*/}.toString().split('\n').slice(1,-1).join('\n'))
    reg.kill()
    return cb(true)
  }

  if (!arg || arg === 'pkg') {
    console.log('Run `how-to-npm verify PKG` but replace `PKG` with the name\n' +
                'of the package that is outdated')
  } else if (arg !== '@linclark/pkg') {
    console.log('Nope, it\'s not %s.  Try again!', arg)
  }

  return cb(false)

}
