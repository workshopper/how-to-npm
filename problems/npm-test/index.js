var path = require('path')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

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
      console.log('Uh oh!  The test failed!\n' +
                  'Try creating a test that actually works.')
      return cb(false)
    }

    console.log('Congratulations!  You wrote a test that passes!\n' +
                'Writing a test that is actually GOOD is left for another time.')
    return cb(true)
  })
}
