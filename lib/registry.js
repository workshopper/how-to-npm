var path = require('path')
var fs = require('fs')
var node = process.execPath
var spawn = require('child_process').spawn
var pidfile = path.resolve(__dirname, '..', 'registry.pid')
var logfile = path.resolve(__dirname, '..', 'registry.log')

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
    }

    _404(req, res)
  }
}

function _404 (req, res) {
  res.statusCode = 404
  res.setHeader('content-type', 'text/json')
  res.end(JSON.stringify({error: 'missing'}))
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

  var file = path.join(__dirname, 'registry-assets', req.url)

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
