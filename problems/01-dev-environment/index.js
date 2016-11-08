var shop = require('../../')
var fs = require('fs')
var path = require('path')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
}

exports.verify = function (args, cb) {
  var datadir = shop.datadir
  var cwd = process.cwd()
  var __ = this.__
  if (path.resolve(cwd, 'problems', 'dev-environment', path.basename(__filename)) === path.resolve(__filename)) {
    console.log(__('dev-environment.err_workshopper'))
    console.log(__('dev-environment.hint'))
    return cb(false)
  }

  if (cwd === process.env.HOME || cwd === process.env.USERPROFILE) {
    console.log(__('dev-environment.err_home'))
    console.log(__('dev-environment.hint'))
    return cb(false)
  }

  try {
    require(path.resolve(cwd, 'package.json'))
  } catch (e) {
    console.log(__('dev-environment.no_package', {error: e.stack}))
    return cb(false)
  }

  // Save the cwd so that we can ensure we're in the right place from now on
  fs.writeFileSync(path.resolve(datadir, 'cwd'), cwd)

  // Write the .npmrc file telling it to always use our local registry.
  var conf = fs.readFileSync(path.resolve(__dirname, '..', '..', 'workshop-npmrc'), 'utf8')
  conf = conf.replace(/%USERCONFIG%/g, path.resolve(datadir, 'npmrc'))

  fs.writeFileSync(path.resolve(cwd, '.npmrc'), conf)

  return cb(null, true, {
    file: path.join(__dirname, 'success.{lang}.txt')
  })
}
