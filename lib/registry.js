var path = require('path')
var fs = require('fs')
var node = process.execPath
var spawn = require('child_process').spawn
var shop = require('../index.js')
var concat = require('concat-stream')
var mkdirp = require('mkdirp')
var semver = require('semver')
var util = require('util')

var pidfile = path.resolve(shop.datadir, 'registry.pid')
var assetdir = path.resolve(shop.datadir, 'registry')

var logStream = fs.createWriteStream(path.resolve(shop.datadir, 'registry.log'), {flags: 'a'})
function log () {
  logStream.write(util.format.apply(util, arguments) + '\n')
}

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
    log('%s Listening', lesson)
  })
}

function handler (args) {
  var lesson = args[0]
  return function (req, res) {
    req.url = unescape(req.url)
    log('%s %s %s', lesson, req.method, req.url)

    switch (lesson) {
      case 'outdated':
      case 'install-a-module':
        // Just the default static handling
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
        if (req.method === 'PUT') return receivePublishPut(req, res)
        break

      case 'dist-tag':
        var parsed = req.url.match(/^\/-\/package\/([^\/]+(\/[^\/]+)?)\/dist-tags(?:\/(.*))?/)
        if (parsed) {
          return handleDistTags(parsed, req, res)
        }
        break
    }

    staticFiles(assetdir, req, res)
  }
}

function handleDistTags (parsed, req, res) {
  log('dist-tag', req.method, req.url)

  var urlName = parsed[1]
  var tag = parsed[3]
  var dataFile = path.resolve(assetdir, urlName, 'body.json')

  if (!fs.existsSync(dataFile)) return _404(req, res)

  var data = require(dataFile)

  if (req.method === 'GET' || req.method === 'HEAD') {
    return res.end(JSON.stringify(data['dist-tags']))
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    req.setEncoding('utf8')
    return req.pipe(concat(function (body) {
      console.error(body)
      body = JSON.parse(body)
      var dt
      if (tag) {
        if (semver.valid(body)) {
          data['dist-tags'][tag] = body
        } else {
          return _403(req, res, { error: 'invalid version' })
        }
      } else if (body && typeof body === 'object' && !tag) {
        if (req.method === 'PUT') {
          data['dist-tags'] = body
        } else {
          for (dt in body) data['dist-tags'][dt] = body[dt]
        }
      }

      for (dt in data['dist-tags']) {
        if (semver.valid(dt)) {
          return _403(req, res, {
            error: 'You may not have a dist tag that is also a valid version'
          })
        }
        var ver = data['dist-tags'][dt]
        if (!data.versions[ver]) {
          return _403(req, res, {
            error: 'Tag points at invalid version: ' + dt + ' -> ' + ver
          })
        }
      }

      try {
        log(tag)
        fs.writeFileSync(dataFile, JSON.stringify(data))
      } catch (er) {
        return _500(req, res, er)
      }
      res.statusCode = 201
      res.end(JSON.stringify({ok: 'created'}))
    }))
  }

  if (req.method === 'DELETE') {
    if (!tag) {
      return _403(req, res, {
        error: 'You must provide a tag to delete'
      })
    }
    log('delete a tag', req.url)
    delete data['dist-tags'][tag]
    try {
      fs.writeFileSync(dataFile, JSON.stringify(data))
    } catch (er) {
      return _500(req, res, er)
    }
    res.statusCode = 201
    return res.end(JSON.stringify({ok: 'deleted'}))
  }

  return _404(req, res)
}

function receivePublishPut (req, res) {
  req.setEncoding('utf8')
  req.pipe(concat(next))

  function next (data) {
    data = JSON.parse(data)
    var ver = Object.keys(data.versions)[0]
    var tgzBase = data._id + '-' + ver + '.tgz'
    var att = data._attachments[tgzBase]
    att = att && att.data
    var dir = path.resolve(assetdir, data._id)
    var jsonFile = path.resolve(dir, 'body.json')
    var tgzFile = path.resolve(dir, '-', tgzBase)

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

    mkdirp.sync(path.dirname(tgzFile))

    if (existing && existing.time && existing.time[ver]) {
      return _403(req, res, {
        message: 'You cannot publish the same version more than once\n' +
          'Bump the version number in package.json, and try again.'
      })
    }

    existing.versions = existing.versions || {}
    existing.versions[ver] = data.versions[ver]

    for (var i in data) {
      if (i !== 'versions' && i !== '_attachments') {
        existing[i] = data[i]
      }
    }

    delete existing._attachments

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
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({error: 'missing'}))
}

function _403 (req, res, er) {
  res.statusCode = 403
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({error: er.stack || er.message}))
}

function _500 (req, res, er) {
  if (er.code === 'ENOENT') return _404(req, res)

  res.statusCode = 500
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({error: er.stack || er.message}))
}

function staticFiles (dir, req, res) {
  if (req.method !== 'GET' && req.url !== 'HEAD') return _404(req, res)

  if (req.url.match(/\.\./)) return _404(req, res)

  var file = path.join(dir, req.url)

  var isJson = false
  var body
  try {
    body = fs.readFileSync(file)
  } catch (er) {
    try {
      body = fs.readFileSync(path.resolve(file, 'body.json'))
      isJson = true
    } catch (er) {
      return _500(req, res, er)
    }
  }

  res.setHeader('content-length', body.length)
  if (isJson) res.setHeader('content-type', 'application/json')
  res.setHeader('connection', 'close')
  res.end(body)
}
