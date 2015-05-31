var forever = require('forever')

var child = new (forever.Monitor)('twainbot.js')

child.on('watch:restart', function (info) {
  console.error('Restaring script because ' + info.file + ' changed')
})

child.on('restart', function () {
  console.error('Forever restarting script for ' + child.times + ' time')
})

child.on('exit:code', function (code) {
  console.error('Forever detected script exited with code ' + code)
})

child.start()
