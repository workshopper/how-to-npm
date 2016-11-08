var path = require('path')
var semver = require('semver')
var shop = require('../../')
var fs = require('fs')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var verfile = path.join(shop.datadir, '/version')
  var __ = this.__
  var pkg = require(shop.cwd() + '/package.json')
  var ver = semver.clean(pkg.version)
  var oldVer
  try {
    oldVer = fs.readFileSync(verfile, 'utf8')
  } catch (er) {
    oldVer = ver
    fs.writeFileSync(verfile, oldVer, 'utf8')
  }
  if (!ver) {
    console.log(__('version.invalid_semver', {version: pkg.version}))
    return cb(false)
  }

  if (ver === oldVer) {
    console.log(__('version.old_version', {version: ver}))
    return cb(false)
  }

  console.log(__('version.success'))

  return cb(true)
}
