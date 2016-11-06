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

  var pj = require(cwd + '/package.json')

  if (!pj.scripts || !pj.scripts.test) {
    console.log(__('npm-test.section_missing'))
    return cb(false)
  }

  // try running the test!
  var exec = require('child_process').exec

  console.log(__('npm-test.running') + '\n\n')
  exec('npm test --color=always', function (er, stdout, stderr) {
    process.stdout.write(stdout)
    process.stderr.write(stderr)

    console.log('\n\n' + __('npm-test.running_done'))

    if (er) {
      console.log(__('npm-test.error'))
      return cb(false)
    }

    console.log(__('npm-test.success'))
    return cb(true)
  })
}
