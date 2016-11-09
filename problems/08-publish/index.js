var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')
var fs = require('fs')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
  this.lang = workshopper.i18n.lang
  reg.run('publish')
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var pkg = require(process.cwd() + '/package.json')
  var name = pkg.name
  var exec = require('child_process').exec
  var npm = '"' + require('which').sync('npm') + '"'
  var __ = this.__
  exec(npm + ' --color=always view ' + name, function (er, stdout, stderr) {
    if (er) {
      process.stderr.write(stderr)

      console.log('\n\n' + __('publish.error', {name: name}) + '\n')
      return cb(false)
    }

    console.log('\n' + fs.readFileSync(path.join(__dirname, 'success.' + this.lang() + '.txt'), 'utf8').replace(/%NAME%/g, name))
    reg.kill()

    return cb(true)
  }.bind(this))
}
