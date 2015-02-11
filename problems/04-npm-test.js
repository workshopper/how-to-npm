var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  var cwd = process.cwd()
  if (!cwd)
    return ''

  return function () {/*
Now you've installed something, and used `npm ls` to show what's going on.

If you look at the package.json file, it has this rather odd bit in it:

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },

npm can be used as a task runner, and almost every module and project
will have a test script that runs to make sure everything is good.  In
order to help remind you to do this, npm puts a "always failing" test
in there by default.

First, create a file called `test.js`.  It doesn't have to do anything,
really.  (This is npm class, not testing class.)  But it has to exit
without throwing an error, or else the test fails.

Then, edit your `package.json` file to make your scripts section look like
this instead:

  "scripts": {
    "test": "node test.js"
  },

Once that's done, run `how-to-npm verify` to check your work.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = function () {/*
//sed -i '' -e 's/echo .*1"$/echo ok ; exit 0"/' package.json
//*/}.toString().split('\n').slice(1,-1).join('\n')

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd)
    return cb(false)

  var pj = require(cwd + '/package.json')

  if (!pj.scripts || !pj.scripts.test) {
    console.log('Oops!  You don\'t have a `scripts.test` section in your\n' +
                'package.json file.  Edit it, and try again.')
    return cb(false)
  }

  // try running the test!
  var exec = require('child_process').exec

  console.log('Running your test script...\n\n')
  exec('npm test --color=always', function (er, stdout, stderr) {
    process.stdout.write(stdout)
    process.stderr.write(stderr)

    console.log('\n\n...done!')

    if (er) {
      console.log('Uh oh!  The test failed!\n'+
                  'Try creating a test that actually works.')
      return cb(false)
    }

    console.log('Congratulations!  You wrote a test that passes!\n'+
                'Writing a test that is actually GOOD is left for another time.')
    return cb(true)
  })
}
