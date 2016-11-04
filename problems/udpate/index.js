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

  var pkg = require(shop.cwd() + '/node_modules/@linclark/pkg/package.json')
  if (pkg.version !== '1.0.3') {
    console.log('Oops!  You are still using the outdated version!')
    return cb(false)
  }

  reg.kill()
  console.log('Awesome!  You\'re up to date!\n' +
              'Run `how-to-npm` to move on to the next exercise')
  return cb(true)
}
