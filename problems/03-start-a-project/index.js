var shop = require('../../')
var reg = require('../../lib/registry.js')
var fs = require('fs')
var path = require('path')

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  this.lang = workshopper.i18n.lang
  reg.run('start-a-project')
}

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  var __ = this.__

  try {
    require(cwd + '/package.json')
  } catch (er) {
    console.log(__('start-a-project.no_package'))
    return cb(false)
  }

  if (/^extracredit$/i.test(args[0] + args[1])) {
    try {
      fs.readFileSync(path.resolve(cwd, '.git', 'config'))
      console.log(__('start-a-project.extra_credit'))
    } catch (er) {
      console.log(fs.readFileSync(path.join(__dirname, 'suggestion.' + this.lang() + '.txt'), 'utf8') + cwd)
      return cb(false)
    }
  } else {
    console.log(fs.readFileSync(path.join(__dirname, 'continue.' + this.lang() + '.txt'), 'utf8'))
  }

  console.log(__('start-a-project.success'))

  return cb(true)
}
