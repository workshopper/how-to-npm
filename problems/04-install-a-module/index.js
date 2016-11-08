var reg = require('../../lib/registry.js')
var shop = require('../../')
var path = require('path')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  reg.run('install-a-module')
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  var __ = this.__

  try {
    require(cwd + '/node_modules/@linclark/pkg')
  } catch (er) {
    console.log(__('install-a-module.error', {error: er}))
    return cb(false)
  }

  console.log(__('install-a-module.success'))
  reg.kill()

  return cb(true)
}
