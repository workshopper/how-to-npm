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
  if (tags.length > 1) {
    console.log('Uh oh, looks like you have some extra dist-tags there.')
    console.log('Use `npm help dist-tag` to learn how to remove them.')
    return cb(false)
  }

  var time = body.time
  var mostRecentTime = ''
  var mostRecentVersion
  for (var v in time) {
    if (!body.versions[v]) continue
    if (time[v] > mostRecentTime) {
      mostRecentTime = time[v]
      mostRecentVersion = v
    }
  }

  if (dt.latest === mostRecentVersion) {
    console.log('Oops!  Your "latest" tag still points at the most recent\n' +
                'release, %s.\n' +
                'Point that somewhere else, and re-run `how-to-npm verify`\n' +
                'Use `npm help dist-tag` to learn more about how to do it.',
                mostRecentVersion)
    return cb(false)
  }

  console.log(function () { /*
Congratulations!  You're a dist-tagging pro!

Run `how-to-npm` to move on to the next exercise.
  */ }.toString().split('\n').slice(1, -1).join('\n'))
  reg.kill()
  return cb(true)
}
