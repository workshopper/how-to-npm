var reg = require('../lib/registry.js')

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.problem = function () {
  if (!shop.cwd())
    return ''


  return function () { /*

It's almost time to say goodbye.  But don't worry!  This is just an
introduction.  If you've finished all the other exercises, then run
`how-to-npm verify` to learn about the next steps beyond this little
adventure.

*/}.toString().split('\n').slice(1,-1).join('\n')
}

//exports.solution = 'npm xmas'

exports.verify = function (args, cb) {
  if (!shop.cwd())
    return cb(false)

  var total = shop._adventures.length
  var completed = shop.state.completed.length
  var remain = total - completed

  // the 1 remaining would be this one, of course
  if (remain > 1) {
    console.log('It looks like you still have more work to do.')
    return cb(false)
  }

  console.log(function () {/*
There is SO MUCH MORE that npm can do.  Some of the things that we didn't
have time to cover in this modest little workshop include:

1. Splitting your app up into multiple modules
2. Sharing private code with teammates using scoped modules
3. Other fun npm commands, like `edit` and `bugs` and `explore`!

You can still learn more about all the fun you and npm can have together.
It all starts with the thought: "There should be a module that does this..."

Your adventure is awaiting you at https://www.npmjs.com/

See you on the internet!

*/}.toString().split('\n').slice(1,-1).join('\n'))

  reg.kill()
  return cb(true)
}
