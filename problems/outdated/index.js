var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var arg = args.join('').toLowerCase()
  if (arg === '@linclark/pkg') {
    console.log(function () { /*
That's absolutely right!  The `@linclark/pkg` package has had an update while we
weren't looking.

In the next lesson, we'll learn how to update packages that are outdated.
    */ }.toString().split('\n').slice(1, -1).join('\n'))
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
