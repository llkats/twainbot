var nconf = require('nconf')
nconf.argv().env().file({ file: 'local.json' })

nconf.defaults({
  consumer_key: 'hahahey',
  consumer_secret: 'hahaweirdbrb',
  access_token_key: 'abc123',
  access_token_secret: 'asdfasdf',
  wordnik_api_key: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
})

module.exports = nconf
