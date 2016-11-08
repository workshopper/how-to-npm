var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  var pkg = require(shop.datadir + '/registry/@linclark/pkg/body.json')
  if (pkg['dist-tags'].latest === '1.0.2') {
    // publish an update
    console.log(path.resolve(__dirname, '..', '..', 'assets', 'registry-update'))
    shop.cpr(path.resolve(__dirname, '..', '..', 'assets', 'registry-update'),
             path.resolve(shop.datadir, 'registry'))
  }
  reg.run('outdated')
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var __ = this.__
  var arg = args.join('').toLowerCase()
  if (arg === '@linclark/pkg') {
    reg.kill()
    return cb(null, true, {
      file: path.join(__dirname, 'success.{lang}.txt')
    })
  }

  if (!arg || arg === 'pkg') {
    console.log(__('outdated.no_package'))
  } else if (arg !== '@linclark/pkg') {
    console.log(__('outdated.wrong_package', {pkg: arg}))
  }

  return cb(false)
}
