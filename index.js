#!/usr/bin/env node

var adventure = require('workshopper-adventure/adventure')
var shop = module.exports = adventure({
  name: 'how-to-npm',
  languages: ['en'],
  appDir: __dirname,
  menu: {
    bg: 'white',
    fg: 'red'
  }
})

var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')

var problems = require('./menu.json')
problems.forEach(function (problem) {
  var p = problem.toLowerCase().replace(/\s/g, '-')
  var dir = path.join(__dirname, 'problems', p)
  shop.add(problem, function () { return require(dir); })
});

shop.execute = function (args) {
  // Reset a bit harder, since we save other stuff in there.
  if (args[0] === 'reset') {
    require('./lib/registry.js').kill()
    rimraf.sync(this.dataDir)
    mkdirp.sync(this.dataDir)
  }

  return shop.constructor.prototype.execute.apply(this, arguments)
}

// Copy the registry-assets if they're not already there.
try {
  var assetsStat = fs.statSync(shop.dataDir + '/registry')
  if (!assetsStat.isDirectory()) throw Error('enotdir')
} catch (er) {
  rimraf.sync(shop.dataDir + '/registry')
  cpr(path.resolve(__dirname, 'lib', 'registry-assets'),
      path.resolve(shop.dataDir, 'registry'))
}

shop.cpr = cpr
function cpr (from, to) {
  var st = fs.statSync(from)
  if (st.isDirectory()) {
    mkdirp.sync(to)
    fs.readdirSync(from).forEach(function (file) {
      cpr(path.resolve(from, file), path.resolve(to, file))
    })
  } else {
    fs.writeFileSync(to, fs.readFileSync(from))
  }
}

shop.cwd = function () {
  var dataDir = shop.dataDir
  // verify we're in the right folder
  try {
    var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()
  } catch (er) {
    console.log('Looks like you are not ready for this one yet!\n' +
                'Go back to the `01 Dev Environment` lesson to set up\n' +
                'your working directory.')
    return false
  }

  if (cwd === process.cwd()) return cwd

  console.log('Uh oh!\n' +
              'It looks like you are in the wrong folder.\n' +
              'Please cd into ' + cwd + '\n' +
              'and then try again')
  return false
}

if (require.main === module) shop.execute(process.argv.slice(2))
