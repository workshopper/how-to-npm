var path = require('path')
var exec = require('child_process').exec
var which = require('which')
var semver = require('semver')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
}

exports.verify = function (args, cb) {
  if (args.join('').toLowerCase() === 'skip') {
    return cb(null, true, {
      file: path.join(__dirname, 'skip.{lang}.txt')
    })
  }

  var __ = this.__

  console.log(__('install-npm.verifying'))
  var npm

  try {
    npm = '"' + which.sync('npm') + '"'
  } catch (er) {
    console.log(__('install-npm.missing'))
    return cb(false)
  }

  // figure out what version we have
  exec(npm + ' --version', function (code, stdout, stderr) {
    var v = ('' + stdout).trim()
    if (code) {
      process.stderr.write(stderr)
      console.log(__('install-npm.npm-problem'), code)
      return cb(false)
    }

    console.log(__('install-npm.version-verified', {version: v}))

    exec(npm + ' view npm version --registry=https://registry.npmjs.org', function (code, stdout, stderr) {
      var latest = ('' + stdout).trim()
      if (code) {
        console.log(__('install-npm.npm-problem'), code)
        process.stderr.write(stderr)
        return cb(false)
      }

      console.log(__('install-npm.latest-version', {version: latest}))
      if (semver.gt(latest, v)) {
        console.log(__('install-npm.upgrade', {version: v, latest: latest}))
        return cb(false)
      }

      console.log(__('install-npm.success'))
      return cb(true)
    })
  })
}
