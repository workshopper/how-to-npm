// Old-sk00l multi-line strings
exports.problem = function () { /*


Run `$ADVENTURE_COMMAND verify` to make sure npm is installed, and up to date.
*/}.toString().split('\n').slice(1,-1).join('\n')


var exec = require('child_process').exec
var node = process.execPath
var which = require('which')
var semver = require('semver')
exports.verify = function (args, cb) {
  console.log('verifying that npm is installed...')
  var npm

  try {
    npm = which.sync('npm')
  } catch (er) {
    console.error('It looks like npm is not installed.')
    return cb(false)
  }

  // figure out what version we have
  exec(npm +' --version', function (code, stdout, stderr) {
    var v = ('' + stdout).trim()
    if (code) {
      console.log('Uh oh!  npm had a problem! %j', code)
      process.stderr.write(stderr)
      return cb(false)
    }

    console.log('You have version %s installed.  Great!', v)

    exec(npm + ' view npm version --registry=https://registry.npmjs.org', function (code, stdout, stderr) {
      var latest = ('' + stdout).trim()
      if (code) {
        console.log('Uh oh!  npm had a problem! %j', code)
        process.stderr.write(stderr)
        return cb(false)
      }

      console.log('The latest npm is: %s', latest)
      if (semver.gt(latest, v)) {
        console.log('You have version %s, but the latest is %s',
                    v, latest)
        console.log('Run `npm install npm -g` to upgrade it')
        console.log('(You can also just skip this if you want)')
        return cb(false)
      }

      console.log('Congratulations!\n' +
                  'You have a recent version of npm installed!')
      return cb(true)
    })
  })
}
