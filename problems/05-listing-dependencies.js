var reg = require('../lib/registry.js')
var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''

  reg.run("install-a-module")
  return function () {/*
npm isn't just for installing stuff.  It also shows you what you
have installed.

You can do this using the `npm ls` command.

Run this command in your working dir, and then run
`how-to-npm verify OK` if everything looks ok,
or `how-to-npm verify NOT OK` if there was a problem.
*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = function () {/*
//npm ls
//how-to-npm verify NOT OK
//npm install @linclark/pkg --save
//npm ls
//how-to-npm verify OK
//*/}.toString().split('\n').slice(1,-1).join('\n')

exports.verify = function (args, cb) {
  // verify we're in the right folder
  var cwd = shop.cwd()
  if (!cwd)
    return false

  // see if there was a problem or not
  var deps = require(cwd + '/package.json').dependencies
  try {
    var pkg = require(cwd + '/node_modules/@linclark/pkg/package.json')
  } catch (er) {}
  var semver = require('semver')
  var ok
  if (!pkg || !deps || !deps["@linclark/pkg"] || !semver.satisfies(pkg.version, deps["@linclark/pkg"]))
    ok = false
  else
    ok = true

  var claim = args.join('').toUpperCase().trim()

  if (claim !== 'OK' && claim !== 'NOTOK') {
    console.log('Please run:\n' +
                '`how-to-npm verify OK` if everything is ok,\n'+
                'or:\n' +
                '`how-to-npm verify NOT OK` otherwise.')
    return cb(false)
  }



  if (claim === 'OK' && !ok) {
    console.log('Sorry, no.  Everything is not ok!\n' +
                'Try running `npm ls` and viewing the error.')
    return cb(false)
  } else if (claim === 'NOTOK' && ok) {
    console.log('Hmm...\n' +
                'Well, there may indeed be a lot wrong with the world,\n' +
                'but your package.json and node_modules folder are fine.')
    return cb(false)
  } else if (ok) {
    console.log('Looks like you fixed the problem.  Fantastic!\n'+
                'Note that `npm ls` is a lot calmer now.')
    reg.kill()
    return cb(true)
  } else {
    console.log(function () {/*
Indeed, not all is well here in dep-land.

Your dependencies should be listed in the package.json file in an
object called 'dependencies'.  However, when we installed '@linclark/pkg',
we didn't update the package.json file to list out this dependency.

So, it shows up as 'extraneous', warning us that we have something
there that we haven't listed as a dependency.

The easiest way to avoid this situation is to use the `--save` flag
when installing dependencies.  You might not want to do this with
things that you're just trying out, but when you decide on something,
you can use this flag to update your package.json file easily.

Try running `npm install @linclark/pkg --save` to install the module, and also
update your package.json file at the same time.

(Another option is to just edit package.json yourself in a text editor)

Then run `how-to-npm verify OK` once you've fixed the problem.
      */}.toString().split('\n').slice(1,-1).join('\n')
    )
    // skip calling the cb, so we can keep working on it.
    return
  }

  throw new Error('should not ever get here')
}
