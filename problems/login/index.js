var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  reg.run('login')
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)
  var __ = this.__

  // test who we are with whoami
  var exec = require('child_process').exec
  var npm = '"' + require('which').sync('npm') + '"'
  exec(npm + ' whoami', function (er, stdout, stderr) {
    var text = (stdout + '').trim() + '\n' + ((stderr || '') + '').trim()

    if (text.match(/Not authed. {2}Run 'npm adduser'/) || text.match(/ENEEDAUTH/)) {
      console.log(__('login.logged_out'))
      return cb(false)
    }

    if (er) {
      process.stdout.write(stdout)
      process.stderr.write(stderr)

      console.log(__('login.whoami_err'))
      return cb(false)
    }

    console.log(__('login.success', {user: (stdout + '').trim()}))
    reg.kill()
    return cb(true)
  })
}
