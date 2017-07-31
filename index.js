#!/usr/bin/env node

var updateNotifier = require('update-notifier')
var pkg = require('./package.json')
var notifier = updateNotifier({
  pkg: pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 // 1 day
})

if (notifier.update) {
  notifier.notify()
  process.exit(0)
}

var adventure = require('workshopper-adventure/adventure')
var shop = module.exports = adventure({
  name: 'how-to-npm',
  languages: ['en', 'es', 'ja', 'fr', 'ko'],
  appDir: __dirname,
  menu: {
    bg: 'white',
    fg: 'red'
  },
  version: require('./package.json').version,
  commands: [{
    name: 'reset-registry',
    handler: function (workshopper) {
      // Reset a bit harder, since we save other stuff in there.
      require('./lib/registry.js').kill()
      rimraf.sync(workshopper.dataDir)
      mkdirp.sync(workshopper.dataDir)
      console.log(workshopper.i18n.__('reset'))
    }
  }]
})

var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')

var problems = require('./menu.json')
problems.forEach(function (problem) {
  var p = problem.toLowerCase().replace(/\s/g, '-')
  var dir = path.join(__dirname, 'problems', p)
  shop.add(problem, function () { return require(dir) })
})

shop.execute = function (args) {
  return shop.constructor.prototype.execute.apply(this, arguments)
}

// Copy the registry-assets if they're not already there.

var fromFolder = path.join(__dirname, 'assets')
var toFolder = path.join(shop.dataDir)

function cpclean (item) {
  var from = path.join(fromFolder, item)
  var to = path.join(toFolder, item)
  try {
    var assetsStat = fs.statSync(to)
    if (!assetsStat.isDirectory()) throw Error('enotdir')
  } catch (er) {
    rimraf.sync(to)
    cpr(from, to)
  }

  try {
    var versionStat = fs.readFileSync(shop.datadir + '/version', 'utf8')
    if (versionStat !== shop.options.version) throw Error('eold')
  } catch (e) {
    fs.writeFileSync(shop.datadir + '/version', shop.options.version)
  }
}

cpclean('registry')

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
    var cwd = fs.readFileSync(path.resolve(dataDir, 'cwd'), 'utf8').trim()
  } catch (er) {
    console.log(shop.i18n.__('error.not_setup'))
    return false
  }

  if (cwd === process.cwd()) return cwd

  console.log(shop.i18n.__('error.wrong_folder', {cwd: cwd}))
  return false
}

if (require.main === module) shop.execute(process.argv.slice(2))
