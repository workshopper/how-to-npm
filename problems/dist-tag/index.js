var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  reg.run('dist-tag')
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  var __ = this.__
  var pkg = require(path.join(cwd, '/package.json'))
  var name = pkg.name

  var body = require(path.join(shop.datadir, 'registry', name, 'body.json'))
  var dt = body['dist-tags']
  var tags = Object.keys(dt)
  if (tags.length === 1) {
    console.log(__('dist-tag.success'))
    return cb(false)
  }

  reg.kill()
  return cb(null, true, {
    file: path.join(__dirname, 'success.{lang}.txt')
  })
}
