var fs = require('fs')
var path = require('path')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  var pkg = require(cwd + '/package.json')
  var deps = Object.keys(pkg.dependencies || {})
  var nm
  try {
    nm = fs.readdirSync(path.resolve(cwd, 'node_modules'))
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

  console.log(function () { /*
Awesome!  You have removed the packages from your node_modules folder,
and also updated your package.json file to reflect that you're no longer
depending on them.

Well done.
  */ }.toString().split('\n').slice(1, -1).join('\n'))
  return cb(true)
}
