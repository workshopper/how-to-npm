var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')
var fs = require('fs')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  this.lang = workshopper.i18n.lang
  reg.run('install-a-module')
}

exports.verify = function (args, cb) {
  // verify we're in the right folder
  var cwd = shop.cwd()
  var __ = this.__
  if (!cwd) return false

  // see if there was a problem or not
  var deps = require(cwd + '/package.json').dependencies
  try {
    var pkg = require(cwd + '/node_modules/@linclark/pkg/package.json')
  } catch (er) {}
  var semver = require('semver')
  var ok
  if (!pkg || !deps || !deps['@linclark/pkg'] || !semver.satisfies(pkg.version, deps['@linclark/pkg'])) {
    ok = false
  } else {
    ok = true
  }

  var claim = args.join('').toUpperCase().trim()

  if (claim !== 'OK' && claim !== 'NOTOK') {
    console.log(__('listing-dependencies.usage'))
    return cb(false)
  }

  if (claim === 'OK' && !ok) {
    console.log(__('listing-dependencies.ok_not'))
    return cb(false)
  } else if (claim === 'NOTOK' && ok) {
    console.log(__('listing-dependencies.not_ok_not'))
    return cb(false)
  } else if (ok) {
    console.log(__('listing-dependencies.success'))
    reg.kill()
    return cb(true)
  } else {
    console.log(fs.readFileSync(path.join(__dirname, 'continue.' + this.lang() + '.txt'), 'utf8'))
    // skip calling the cb, so we can keep working on it.
    return
  }
}
