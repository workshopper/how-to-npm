// Old-sk00l multi-line strings
exports.problem = function () { /*
Hello, and welcome to the npm adventure workshop!  I am going to be
asking you to do various things with npm so that you can get started
with it easily.

Some helpful commands:

npm help ............ Get help with npm
how-to-npm print .... Re-display the current exercise
how-to-npm verify ... Verify that you have finished an exercise
how-to-npm solution . Show the solution for the current exercise

The first thing we're going to do is make sure that your npm
version is up to date.

Run `how-to-npm verify` once that is done.

(This is the only part of the workshop that requires network access.
If the network is busted, and you want to skip this one, you can run
`how-to-npm verify skip` to skip it.)
*/ }.toString().split('\n').slice(1, -1).join('\n')

// exports.solution = '[sudo] npm install npm -g'

var exec = require('child_process').exec
var which = require('which')
var semver = require('semver')
exports.verify = function (args, cb) {
  if (args.join('').toLowerCase() === 'skip') {
    console.log('Ok, if you say so...\n' +
                'You can always install the latest and greatest npm using\n' +
                '`npm install npm -g`.  You may need to run that with `sudo`\n' +
                'or as an Administrator.')
    return cb(true)
  }

  console.log('verifying that npm is installed...')
  var npm

  try {
    npm = '"' + which.sync('npm') + '"'
  } catch (er) {
    console.error('It looks like npm is not installed.')
    return cb(false)
  }

  // figure out what version we have
  exec(npm + ' --version', function (code, stdout, stderr) {
    var v = ('' + stdout).trim()
    if (code) {
      console.log('Uh oh!  npm had a problem! %j', code)
      process.stderr.write(stderr)
      return cb(false)
    }

    console.log('You have version %s installed.  Great!', v)
    console.log('Now let\'s see what the latest version is... wait for it...')

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
