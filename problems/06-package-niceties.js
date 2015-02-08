var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')
var datadir = shop.datadir
// verify we're in the right folder
var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

exports.problem = function () {
  var pkg = require(cwd + '/package.json')
  var id = pkg.name + '@' + pkg.version

  return function () { /*
So, we've created a package.json file, but it's missing a few things
that people usually expect.  If you type `npm install`, you'll see
something like this:

    npm WARN package.json %ID% No description
    npm WARN package.json %ID% No repository field.
    npm WARN package.json %ID% No README data

Before we can share this work of art with the world, we need to make
it a bit more polished so that people know how to use it.

First, create a README.md file, with a bit of words in it.

Then, add a "repository" field in your package.json file, with a url
where people can access the code.

Run `how-to-npm verify` when you're done.
*/}.toString().split('\n').slice(1,-1).join('\n').replace(/%ID%/g, id)
}

exports.verify = function (args, cb) {
  //TODO: DRY this up.  It's getting rather tedious.
  var datadir = shop.datadir
  // verify we're in the right folder
  var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

  if (cwd !== process.cwd()) {
    console.log('Uh oh!\n'+
                'It looks like you are in the wrong folder.\n'+
                'Please cd into ' + cwd +'\n'+
                'and then try again')
    return cb(false)
  }

  // make sure we get no warnings 
  var exec = require('child_process').exec
  var npm = require('which').sync('npm')
  exec(npm + ' i', function (er, stdout, stderr) {
    if (er) {
      process.stdout.write(stdout)
      process.stderr.write(stderr)

      console.log('\nUh oh!\n' +
                  'It looks like something went wrong')
      return cb(false)
    }

    stderr = (stderr + '').trim()
    if (stderr.match(/npm WARN package\.json/)) {
      console.log('\nNot quite!\n' +
                  'There\'s still a problem to fix.\n\n'+
                  stderr + '\n')
      return cb(false)
    }

    console.log('Looking sharp!\n' +
                'A package without a readme and some metadata is like a\n'+
                'bunch of JavaScript without instructions or git repo links.')
    return cb(true)
  })
}
