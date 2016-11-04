var path = require('path')
var reg = require('../../lib/registry.js')
var shop = require('../../')

exports.init = function (workshopper) {
  this.problem = {
    file: path.join(__dirname, 'problem.{workshopper.lang}.txt')
  }
}

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd) return cb(false)

  var pkg = require(cwd + '/package.json')
  var name = pkg.name

  var body = require(shop.datadir + '/registry/' + name + '/body.json')
  var dt = body['dist-tags']
  var tags = Object.keys(dt)
  if (tags.length === 1) {
    console.log('Uh oh, looks like you still only have a single dist-tag.')
    console.log('Use `npm help dist-tag` to learn how to add another one.')
    return cb(false)
  }

  console.log(function () { /*
Congratulations!  You've added a dist-tag!

This is a handy way to manage releases.  For example, the npm project
itself publishes each new version as 'next' (instead of 'latest') so
that beta users can test it out before it becomes the default.

Run `how-to-npm` to move on to the next exercise.
  */ }.toString().split('\n').slice(1, -1).join('\n'))
  reg.kill()
  return cb(true)
}
