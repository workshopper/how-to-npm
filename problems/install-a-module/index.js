var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  try {
    require(cwd + '/node_modules/@linclark/pkg')
  } catch (er) {
    console.log('Uh oh!  Looks like it didn\'t install right.\n' +
                'The error I got was: \n' +
                (er.stack || er.message) + '\n' +
                'Make sure you use the `npm install @linclark/pkg` command\n' +
                'to install the `@linclark/pkg` module.')
    return cb(false)
  }

  console.log('Congratulations! You installed it.')
  reg.kill()

  return cb(true)
}
