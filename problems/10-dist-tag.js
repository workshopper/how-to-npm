var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  reg.run('dist-tag')
  return function () { /*
Every published package on npm has a `dist-tags` entry on it which
maps strings like "latest" to version numbers like "1.2.48".

By default, the "latest" version is what gets installed.  When you
publish, the version that you publish gets tagged as "latest".  This
is generally great, because most of the time you publish things when
you're ready for users to use them.

However, if you need to publish something, and *not* make it the
default version of a package (for example, if it's a security release
for a legacy version, or something), then you can manually manage
these distribution tags with the `dist-tag` function.

Run `npm help dist-tag` to learn more about it.

Try adding a dist-tag on your package.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm dist-tag add test@1.0.0 old'

exports.verify = function (args, cb) {
  var cwd = shop.cwd()
  if (!cwd)
    return cb(false)

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

  console.log(function () {/*
Congratulations!  You've added a dist-tag!

This is a handy way to manage releases.  For example, the npm project
itself publishes each new version as 'next' (instead of 'latest') so
that beta users can test it out before it becomes the default.

Run `how-to-npm` to move on to the next exercise.
*/}.toString().split('\n').slice(1,-1).join('\n'))
  reg.kill()
  return cb(true)
}
