var path = require('path')
var fs = require('fs')
var node = process.execPath
var spawn = require('child_process').spawn
var shop = require('../index.js')
var concat = require('concat-stream')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')

var pidfile = path.resolve(shop.datadir, 'registry.pid')
var logfile = path.resolve(shop.datadir, 'registry.log')
var assetdir = path.resolve(shop.datadir, 'registry')

if (require.main === module) {
  switch (process.argv[2]) {
    case 'daemon':
      daemon(process.argv.slice(3))
      break
    case 'kill':
      kill()
      break
  }
}

exports.kill = kill
function kill () {
  try {
    var pid = +fs.readFileSync(pidfile, 'ascii').trim()
    process.kill(pid, 'SIGKILL')
  } catch (er) {}
  try {
    fs.unlinkSync(pidfile)
  } catch (er) {}
}

exports.run = run
function run (args) {
  kill()

  var child = spawn(node, [__filename, 'daemon'].concat(args || []), {
    stdio: 'ignore',
    detached: true,
    cwd: path.resolve(__dirname, '..')
  })
  child.unref()
}

exports.daemon = daemon
function daemon (args) {
  kill()

  var fd = fs.openSync(pidfile, 'wx')
  fs.writeSync(fd, process.pid + '\n')
  fs.closeSync(fd)

  var http = require('http')
  var lesson = args[0]
  var server = http.createServer(handler(args))
  server.listen(15443, function () {
    console.log('%s Listening', lesson)
  })
}

function handler (args) {
  var lesson = args[0]
  return function (req, res) {
    console.log('%s %s %s', lesson, req.method, req.url)

    switch (lesson) {
      case 'install-a-module':
        if (req.url.match(/^\/(wrappy|once)/)) {
          static(req, res)
          return
        }
        break

      case 'login':
        if (req.url.match(/^\/-\/user\/org.couchdb.user:/)) {
          if (req.method === 'PUT') {
            res.statusCode = 201
            return res.end(JSON.stringify({ ok: 'created' }))
          }
        }
        break

      case 'publish':
        try {
          var pkg = require(process.cwd() + '/package.json')
        } catch (er) {
          return _403(req, res, {
            message: 'Make sure you are in the right directory!'
          })
        }
        if (req.method === 'PUT')
          return receivePublishPut(req, res)
        else
          return static(req, res)
    }

    _404(req, res)
  }
}

function receivePublishPut (req, res) {
  req.setEncoding('utf8')
  req.pipe(concat(next))

  function next(data) {
    data = JSON.parse(data)
    var ver = Object.keys(data.versions)[0]
    var tgzBase = data._id + '-' + ver +'.tgz'
    var att = data._attachments[tgzBase]
    att = att && att.data
    var dir = path.resolve(assetdir, data._id)
    var jsonFile = path.resolve(dir, 'json')
    var tgzDir = path.resolve(dir, '-')
    var tgzFile = path.resolve(tgzDir, tgzBase)

    if (!att) {
      return _403(req, res, {
        message: 'no tarball attachment'
      })
    }

    if (!data._id) {
      return _403(req, res, {
        message: 'invalid package name'
      })
    }

    try {
      var existing = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
    } catch (er) {
      existing = {}
    }

    mkdirp.sync(tgzDir)

    if (existing && existing.time && existing.time[ver]) {
      return _403(req, res, {
        message: 'You cannot publish the same version more than once\n' +
          'Bump the version number in package.json, and try again.'
      })
    }

    existing.versions = existing.versions || {}
    existing.versions[ver] = data.versions[ver]

    for (var i in data) {
      if (i !== 'versions') {
        existing[i] = data[i]
      }
    }

    existing.time = existing.time || {}
    var now = new Date().toISOString()
    existing.time[ver] = now
    existing.time.created = existing.time.created || now
    existing.time.modified = now

    try {
      fs.writeFileSync(tgzFile, att, { encoding: 'base64' })
    } catch (er) {
      return _500(req, res, er)
    }

    try {
      fs.writeFileSync(jsonFile, JSON.stringify(existing))
    } catch (er) {
      return _500(req, res, er)
    }

    res.statusCode = 201
    res.end(JSON.stringify({ok: 'created'}))
  }
}

function _404 (req, res) {
  res.statusCode = 404
  res.setHeader('content-type', 'text/json')
  res.end(JSON.stringify({error: 'missing'}))
}

function _403 (req, res, er) {
  res.statusCode = 403
  res.setHeader('content-type', 'text/json')
  res.end(JSON.stringify({error: er.stack || er.message}))
}

function _500 (req, res, er) {
  if (er.code === 'ENOENT')
    return _404(req, res)

  res.statusCode = 500
  res.setHeader('content-type', 'text/json')
  res.end(JSON.stringify({error: er.stack || er.message}))
}

function static (req, res) {
  if (req.method !== 'GET' && req.url !== 'HEAD')
    return _404(req, res)

  if (req.url.match(/\.\./))
    return _404(req, res)

  var file = path.join(assetdir, req.url)

  var isJson = false
  try {
    var body = fs.readFileSync(file)
  } catch (er) {
    try {
      var body = fs.readFileSync(path.resolve(file, 'json'))
      var isJson = true
    } catch (er) {
      return _500(req, res, er)
    }
  }

  res.setHeader('content-length', body.length)
  if (isJson)
    res.setHeader('content-type', 'application/json')
  res.setHeader('connection', 'close')
  res.end(body)
}
