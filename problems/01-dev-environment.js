// Old-sk00l multi-line strings
exports.problem = function () { /*
One of the most important things that npm does is install packages.

However, in order to be a good workshop program, we don't want to litter
files all over your computer, so before going any further, let's set up a
development environment.

First, make a new directory and `cd` into it.

Then, run `npm init` to create a package.json file.  (For extra credit, set
it up as a git repo as well.)

Run `$ADVENTURE_COMMAND verify` once you're done.  All the other commands
you run in this tutorial should be done in that folder.
*/}.toString().split('\n').slice(1,-1).join('\n')

//exports.solution = function () {/*
//mkdir test
//cd test
//npm init
//# fill in all the prompts
//
//# Extra Credit:
//git init
//*/}.toString().split('\n').slice(1,-1).join('\n')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.verify = function (args, cb) {
  var datadir = shop.datadir
  var cwd = process.cwd()
  if (path.resolve(cwd, 'problems', path.basename(__filename)) === path.resolve(__filename)) {
    console.log('It looks like you are in the root of the workshopper\n' +
                'That is not wise.  Please make a new dir, and use that.')
    return cb(false)
  }

  if (cwd === process.env.HOME || cwd === process.env.USERPROFILE) {
    console.log('It looks like you are in your home directory.\n' +
                'That is not wise.  Please make a new dir, and use that.')
    return cb(false)
  }

  var pkg
  try {
    pkg = require(cwd + '/package.json')
  } catch (er) {
    console.log('No package.json found.\n' +
                'Please run `npm init` in your working directory.')
    return cb(false)
  }

  if (/^extracredit$/i.test(args[0] + args[1])) {
    try {
      fs.readFileSync(path.resolve(cwd, '.git', 'config'))
      console.log('EXTRA CREDIT!  Nicely done.\n')
    } catch (er) {
      console.log('Well, you got everything except the git part.\n'+
                  'The convention is one git repo per module, so\n'+
                  'you usually ought to run `git init` at the root\n'+
                  'of your project.\n'+
                  'Remove the .git folder from wherever you were,\n'+
                  'and run `git init` in ' + cwd)
      return cb(false)
    }
  } else {
    console.log('For extra credit, try also setting up this dir as\n'+
                'a git repository.\n\n'+
                'The convention is to have a single git repo for each\n'+
                'module or project.  Use the `git init` command to set\n'+
                'up your working dir as a git project.\n\n'+
                'Then, run `how-to-npm verify extra credit`\n\n')
  }

  console.log(
    'Congratulations!\n' +
    'You created an npm package!  View the package.json file to see it.\n' +
    '\n'+
    'From here on out, make sure to run the workshop in this dir\n'+
    '\n'+
    'You might notice that a `.npmrc` file will show up in there.\n' +
    'That normaly would not be required, but the workshop uses it\n' +
    'to mock out the parts that would normally talk to the internet.'
  )

  // Save the cwd so that we can ensure we're in the right place from now on
  fs.writeFileSync(path.resolve(datadir, 'cwd'), cwd)

  // Write the .npmrc file telling it to always use our local registry.
  var conf = fs.readFileSync(path.resolve(__dirname, '..', 'workshop-npmrc'), 'utf8')
  conf = conf.replace(/%USERCONFIG%/g, path.resolve(datadir, 'npmrc'))

  fs.writeFileSync(path.resolve(cwd, '.npmrc'), conf)

  return cb(true)
}
