var path = require('path')
var fs = require('fs')
var node = process.execPath
var spawn = require('child_process').spawn
var shop = require('../index.js')
var util = require('util')
var verdaccio = require('verdaccio').default
var yalm = require('js-yaml')

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
  var yamlConfigPath = path.join(__dirname, './_config.yaml')
  var yamlConfig = fs.readFileSync(yamlConfigPath, 'utf8')
  var configJsonFormat = yalm.safeLoad(yamlConfig)
  var lesson = args[0]
  configJsonFormat.storage = path.resolve(assetdir, 'store')
  configJsonFormat.self_path = path.resolve(assetdir)
  verdaccio(configJsonFormat, 15443, yamlConfigPath, '1.0.0', 'verdaccio',
    function (webServer, addrs, pkgName, pkgVersion) {
      webServer.listen(addrs.port || addrs.path, addrs.host, function () {
        log('%s Listening', lesson)
      })
    })
}
