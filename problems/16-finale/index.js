var shop = require('../../')
var path = require('path')

exports.problem = {
  file: path.join(__dirname, 'problem.{lang}.txt')
}

exports.init = function (workshopper) {
  this.__ = workshopper.i18n.__
}

exports.verify = function (args, cb) {
  if (!shop.cwd()) return cb(false)

  var __ = this.__
  var completed = shop.appStorage.get('completed')
  var leftOver = shop.exercises.filter(function (specifier) {
    return completed.indexOf(specifier) === -1 && specifier !== '16 Finale'
  })

  // the 1 remaining would be this one, of course
  if (leftOver.length > 0) {
    console.log(__('finale.todo') + '\n')
    leftOver.forEach(function (id) {
      console.log(' - ' + __('exercise.' + id))
    })
    console.log('')
    return cb(false)
  }

  return cb(null, true, {
    file: path.join(__dirname, 'success.{lang}.txt')
  })
}
