var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var pkg = require(process.cwd() + '/package.json')
  var name = pkg.name
  var exec = require('child_process').exec
  var npm = '"' + require('which').sync('npm') + '"'
  exec(npm + ' --color=always view ' + name, function (er, stdout, stderr) {
    if (er) {
      process.stderr.write(stderr)
      console.log('Uh oh!\n' +
                  'It looks like you didn\'t successfully publish the ' +
                  name + '\n' +
                  'package.  Try again!\n')
    }

    console.log(function () { /*
In order to view your package content, I just ran this command:

  npm view %NAME%

Run that command yourself to see what it prints out.

The `npm view` command is a great way to view package details,
to see what you just published, and to check if a name is already taken.

Now that you've published your first package here in make-believe npm
workshop land, go out and write a real thing to share with real humans!

You don't have to just share code for other people, though.  There are
also benefits to breaking up your code into small manageable pieces, even
if you are only using them all yourself.

You can imagine that your future self and your past self are the two
other developers on your team.  (Scheduling meetings is pretty tricky.)

Run `how-to-npm` to go on to the next adventure!
    */ }.toString().split('\n').slice(1, -1).join('\n').replace(/%NAME%/g, name))
    reg.kill()

    return cb(true)
  })
}
