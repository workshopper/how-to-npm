var path = require('path')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  // verify we're in the right folder
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  // make sure we get no warnings
  var exec = require('child_process').exec
  var npm = '"' + require('which').sync('npm') + '"'
  exec(npm + ' i', function (er, stdout, stderr) {
    if (er) {
      process.stdout.write(stdout)
      process.stderr.write(stderr)

      console.log('\nUh oh!\n' +
                  'It looks like something went wrong')
      return cb(false)
    }

    stderr = (stderr + '').trim()
    if (stderr.match(/npm WARN package\.json/)) {
      console.log('\nNot quite!\n' +
                  'There\'s still a problem to fix.\n\n' +
                  stderr + '\n')
      return cb(false)
    }

    console.log('Looking sharp!\n' +
                'A package without a readme and some metadata is like a\n' +
                'bunch of JavaScript without instructions or git repo links.')
    return cb(true)
  })
}
