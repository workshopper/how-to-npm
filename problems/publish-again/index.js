var path = require('path')
var semver = require('semver')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  this.lang = workshopper.i18n.lang
  reg.run('publish')
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var __ = this.__
  var pkg = require(path.join(shop.cwd(), 'package.json'))
  var data = require(path.join(shop.datadir, 'registry', pkg.name, 'body.json'))
  var ver = semver.clean(pkg.version)

  // should be more than one entry in the time obj, and the current
  // version should be in there.
  var releases = Object.keys(data.time).filter(function (v) {
    return v !== 'created' && v !== 'modified'
  })

  if (releases.length <= 1) {
    console.log(__('publish-again.not_republished'))
    return cb(false)
  }

  if (releases.indexOf(ver) === -1) {
    console.log(__('publish-again.current_missing', {
      version: ver,
      found: JSON.stringify(releases, null, 2)
    }))
    return cb(false)
  }

  console.log(__('publish-again.success'))
  reg.kill()
  return cb(true)
}
