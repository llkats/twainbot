var fs = require('fs')
var request = require('request')
var waterfall = require('async').waterfall
var Twitter = require('twitter')
var conf = require('./conf')

var wordnikRequest = request.defaults({
  baseUrl: 'http://api.wordnik.com:80/v4/'
})

var wordnikKey = conf.get('wordnik_api_key')

var wordnikParams = 'hasDictionaryDef=true&minCorpusCount=20&maxCorpusCount=-1&minDictionaryCount=10&maxDictionaryCount=-1&minLength=2&maxLength=12&api_key='

var createTweet = function () {
  waterfall([
    function getAdjective (callback) {
      wordnikRequest({
        method: 'GET',
        uri: 'words.json/randomWord?includePartOfSpeech=adjective&' + wordnikParams + wordnikKey
      }, function (error, response, body) {
        if (error) console.log(error)

        var adjective = JSON.parse(body)

        callback(null, adjective.word)
      })
    },
    function getCity (adjective, callback) {
      fs.readFile('data/cities-processed.txt', {encoding: 'utf8'}, function (err, data) {
        if (err) log('error grabbing city: ' + err)

        var lines = data.split('\n')
        var randoCity = lines[Math.floor(Math.random() * lines.length)]

        callback(null, {
          adjective: adjective,
          city: randoCity
        })
      })
    },
    function getOppositeNouns (words, callback) {
      var adj = words.adjective
      var city = words.city

      wordnikRequest({
        method: 'GET',
        uri: 'words.json/randomWords?includePartOfSpeech=noun&excludePartOfSpeech=proper-noun,noun-plural,proper-noun-plural&limit=100&' + wordnikParams + wordnikKey
      }, function (error, response, body) {
        if (error) console.log(error)

        if (response.statusCode === 200) {
          var wordlist = JSON.parse(body)

          var findOpposite = function () {
            var word = wordlist.shift().word
            wordnikRequest({
              method: 'GET',
              uri: 'word.json/' + word + '/relatedWords?relationshipTypes=antonym&useCanonical=true&limitPerRelationshipType=10&api_key=' + wordnikKey
            }, function (error, response, body) {
              if (error) console.log(error)

              var result = JSON.parse(body)
              if (response.statusCode === 200 && result.length > 0) {
                callback(null, {
                  adjective: adj,
                  city: city,
                  noun: word,
                  antonym: result[0].words[0]
                })
              } else {
                findOpposite()
              }
            })
          }
          findOpposite()
        }
      })
    },
    function endResult (words) {
      if (words) {
        postTweet('The most ' + words.adjective + ' ' + words.noun + ' ' + 'I ever spent was a ' + words.antonym + ' in ' + words.city + '.')
      } else {
        // todo: write out the keys and values of the words object for a more helpful log error message
        log('no words found: ' + words)
      }
    }
  ])
}

var postTweet = function (quip) {

  var client = new Twitter({
    consumer_key: conf.get('consumer_key'),
    consumer_secret: conf.get('consumer_secret'),
    access_token_key: conf.get('access_token_key'),
    access_token_secret: conf.get('access_token_secret')
  })

  client.post('statuses/update', {status: quip}, function (error, tweet, response) {
    if (error) {
      log('tweeting: ' + error + ' ' + response)
    }

    log('tweeted: ' + quip)
    console.log(quip)
  })
}

var log = function (message) {
  // var date = new Date()
  // var datestring = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDay()

  process.stdout.write(message)
}

// tweet every four hours
var interval = 1000 * 60 * 60 * 4
var init = function () {
  createTweet()
  setInterval(function () {
    createTweet()
  }, interval)
}

init()
