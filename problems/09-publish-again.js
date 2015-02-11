var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var semver = require('semver')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  reg.run('publish')
  return function () { /*
Publishing something once is fine.  But healthy packages get
published again and again with new and exciting bug fixes.

You can't re-use the same version number again, because that's hella
confusing for all the robots running the treadmills that power the npm
registry.  But, now that we changed the version number in the last
exercise, you can publish the package again.

Go for it!  Then get your prize with `how-to-npm verify`
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm publish'

exports.verify = function (args, cb) {
  if (!shop.cwd())
    return cb(false)

  var pkg = require(shop.cwd() + '/package.json')
  var data = require(shop.datadir + '/registry/' + pkg.name + '/body.json')
  var ver = semver.clean(pkg.version)

  // should be more than one entry in the time obj, and the current
  // version should be in there.
  var releases = Object.keys(data.time).filter(function (v) {
    return v !== 'created' && v !== 'modified'
  })

  if (releases.length <= 1) {
    console.log('Whoops!\n' +
                'Looks like you did not publish the package again\n' +
                'Try running `npm publish` and then verifying again.')
    return cb(false)
  }

  if (releases.indexOf(ver) === -1) {
    console.log('Hmm... I see that you published more than once, but\n' +
                'the current version (%s) is not in the set.\n' +
                'Here\'s what I see in there:\n' +
                '%s\n' +
                'Try publishing again!',
                ver, JSON.stringify(releases, null, 2))
    return cb(false)
  }

  console.log('Wow!  You are well on your way to becoming a regular\n' +
              'TJames "Substack" Halidaychuk!  There\'s no stopping you!\n' +
              'Run `how-to-npm` to go to the next step.')
  reg.kill()
  return cb(true)
}
