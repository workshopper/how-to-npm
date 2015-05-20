var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  reg.run('dist-tag')
  return function () { /*
Now that you've added a dist-tag or two, let's clean things up.

The only dist-tag you CAN'T ever remove is "latest".  That's because
every package installs it's "latest" tag by default, so that tag has
some special semantics.

You CAN point "latest" to a different version, or delete other tags.

Let's delete all the tags that we can, and also point "latest" at
something other than the most recent release.

Run `npm help dist-tag` to learn more about the command.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = function () {/*
//npm dist-tag add test@1.0.0 latest
//npm dist-tag rm test old
//*/}.toString().split('\n').slice(1,-1).join('\n')

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd)
    return cb(false)

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
    if (!body.versions[v])
      continue
    if (time[v] > mostRecentTime) {
      mostRecentTime = time[v]
      mostRecentVersion = v
    }
  }

  if (dt.latest === mostRecentVersion) {
    console.log('Oops!  Your "latest" tag still points at the most recent\n' +
                'release, %s.\n' +
                'Point that somewhere else, and re-run `how-to-npm verify`\n'+
                'Use `npm help dist-tag` to learn more about how to do it.',
                mostRecentVersion)
    return cb(false)
  }

  console.log(function () {/*
Congratulations!  You're a dist-tagging pro!

Run `how-to-npm` to move on to the next exercise.
*/}.toString().split('\n').slice(1,-1).join('\n'))
  reg.kill()
  return cb(true)
}
