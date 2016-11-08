var fs = require('fs')
var path = require('path')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  var __ = this.__
  var pkg = require(cwd + '/package.json')
  var deps = Object.keys(pkg.dependencies || {})
  var nm
  try {
    nm = fs.readdirSync(path.resolve(cwd, 'node_modules'))
    nm = nm.filter(function (n) {
      return !/^\./.test(n)
    })
  } catch (er) {
    nm = []
  }

  if (nm.length) {
    console.log(__('rm.dependencies_left'))
    return cb(false)
  }

  if (deps.length) {
    console.log(__('rm.package_json_left'))
    return cb(false)
  }

  return cb(null, true, {
    file: path.join(__dirname, 'success.{lang}.txt')
  })
}
