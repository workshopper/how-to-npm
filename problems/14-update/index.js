var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  reg.run('outdated')
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var __ = this.__
  var pkg = require(path.join(shop.cwd(), '/node_modules/@linclark/pkg/package.json'))
  if (pkg.version !== '1.0.3') {
    console.log(__('update.outdated'))
    return cb(false)
  }

  reg.kill()
  console.log(__('update.success'))
  return cb(true)
}
