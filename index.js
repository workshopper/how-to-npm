if (require.main !== module) {
  console.error('how-to-npm should only be run as a bin script')
  return
}

var adventure = require('adventure')
var shop = module.exports = adventure({
  name: 'how-to-npm',
  bg: 'white',
  fg: 'red'
})

var fs = require('fs')
var path = require('path')

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

shop.execute(process.argv.slice(2))
