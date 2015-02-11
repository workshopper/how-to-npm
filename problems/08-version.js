var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var semver = require('semver')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  // capture the current version in the datadir
  var pkg = require(shop.cwd() + '/package.json')
  var ver = semver.clean(pkg.version)
  if (!ver) {
    return 'Looks like your package.json has an invalid version!\n' +
      'Use `npm help semver` to learn more about version numbers\n' +
      'Your current version number is: ' + pkg.version
  }

  var oldVer
  var verfile = shop.datadir + '/version'
  try {
    oldVer = fs.readFileSync(verfile, 'utf8')
  } catch (er) {
    oldVer = ver
    fs.writeFileSync(verfile, oldVer, 'utf8')
  }

  return function () { /*
Every package in npm has a version number associated with it.  As
you release updates to your package, these updates get an updated
version number.

Version numbers in npm follow a standard called "SemVer".  This stands
for "Semantic Version".  The specification for this standard can be
found at http://semver.org.

The tl;dr version is that for a version like this:

  1.2.3
  ^ ^ ^
  | | `-- Patch version. Update for every change.
  | `---- Minor version. Update for API additions.
  `------ Major version. Update for breaking API changes.

npm has a special command called `npm version` which will update your
package.json file for you, and also commit the change to git if your
project is a git repository.  You can learn more at `npm help version`.

Or, if you don't trust the machines, you can open up your package.json
file by hand, and put some new numbers in the "version" field.

The npm registry won't let you publish a new release of your package
without updating the version number!  Ever!  So, get used to the idea of
bumping the version whenever you want to publish, even if the change is
really minor.

Don't worry, there's a lot of integers, we probably won't run out.

Update your version number now, and then `how-to-npm verify` to check it.

*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm version patch'

exports.verify = function (args, cb) {
  if (!shop.cwd())
    return cb(false)

  var verfile = shop.datadir + '/version'
  var oldVer = fs.readFileSync(verfile, 'utf8')
  var pkg = require(shop.cwd() + '/package.json')
  var ver = semver.clean(pkg.version)
  if (!ver) {
    console.log('Looks like your package.json has an invalid version!\n' +
      'Use `npm help semver` to learn more about version numbers\n' +
      'Your current version number is: ' + pkg.version)
    return cb(false)
  }

  if (ver === oldVer) {
    console.log('Uh oh!\n' +
                'The version is still ' + oldVer + '\n' +
                'Check `npm help version` for a handy util to do this.')
    return cb(false)
  }

  console.log('Great job!\n' +
              'Run `how-to-npm` for the next exciting challenge!')

  return cb(true)
}
