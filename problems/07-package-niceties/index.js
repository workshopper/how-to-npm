var path = require('path')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
}

exports.verify = function (args, cb) {
  // verify we're in the right folder
  var cwd = shop.cwd()
  if (!cwd) return cb(false)
  var __ = this.__

  // make sure we get no warnings
  var exec = require('child_process').exec
  var npm = '"' + require('which').sync('npm') + '"'
  exec(npm + ' i', function (er, stdout, stderr) {
    if (er) {
      process.stdout.write(stdout)
      process.stderr.write(stderr)

      console.log('\n' + __('package-niceties.error'))
      return cb(false)
    }

    var pj = require(cwd + '/package.json')

    stderr = (stderr + '').trim()
    var reg = new RegExp('npm WARN (package.json|' + pj.name + ')')
    if (reg.test(stderr)) {
      console.log('\n' + __('package-niceties.problem') + '\n\n' +
                  stderr + '\n')
      return cb(false)
    }

    console.log(__('package-niceties.success'))
    return cb(true)
  })
}
