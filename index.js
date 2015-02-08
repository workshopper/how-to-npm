#!/usr/bin/env node

var adventure = require('adventure')
var shop = module.exports = adventure({
  name: 'how-to-npm',
  bg: 'white',
  fg: 'red'
})

var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')

var problems = fs.readdirSync(path.resolve(__dirname, 'problems'))
problems.filter(function (problem) {
  return problem.match(/^[^.].*\.js$/)
}).forEach(function (problem) {
  var name = problem.replace(/\.js$/, '').split('-').map(function (p) {
    if (p === 'npm')
      return p
    return p.charAt(0).toUpperCase() + p.slice(1)
  }).join(' ')
  shop.add(name, function () {
    return require('./problems/' + problem)
  })
})

shop.execute = function (args) {
  // Reset a bit harder, since we save other stuff in there.
  if (args[0] === 'reset') {
    rimraf.sync(this.datadir)
    mkdirp.sync(this.datadir)
  }

  return shop.constructor.prototype.execute.apply(this, arguments)
}

// Copy the registry-assets if they're not already there.
try {
  var assetsStat = fs.statSync(shop.datadir + '/registry')
  if (!assetsStat.isDirectory()) throw 'enotdir'
} catch (er) {
  rimraf.sync(shop.datadir + '/registry')
  cpr(path.resolve(__dirname, 'lib', 'registry-assets'),
      path.resolve(shop.datadir, 'registry'))
}

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

if (require.main === module)
  shop.execute(process.argv.slice(2))
