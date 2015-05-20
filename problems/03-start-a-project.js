// Old-sk00l multi-line strings
exports.problem = function () { /*
npm helps you build projects, but for npm to be able to do that, you need
to tell npm a little bit about your project. You can tell npm about your
project in a file called package.json.

Run `npm init --scope=<username>`, and replace <username> with the user
you created in the last lesson. This will create a package.json file.
(For extra credit, set the project up with a git repo as well.)

Run `$ADVENTURE_COMMAND verify` once you're done.
*/}.toString().split('\n').slice(1,-1).join('\n')

//exports.solution = function () {/*
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
  var cwd = shop.cwd()
  if (!cwd)
    return cb(false)

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
    'You created a project!  View the package.json file to see it.\n'
  )

  return cb(true)
}
