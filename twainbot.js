var fs = require('fs')
var util = require('util')

var Twitter = require('twitter')
var corpora = require('corpora-project')
var conf = require('./conf')

// return a random index from the supplied array
var randomIndex = function (arr) {
  return Math.floor(Math.random() * (arr.length + 1))
}

var getVerb = function () {
  var verbs = corpora.getFile('words', 'verbs').verbs

  return verbs[randomIndex(verbs)].past
}

var getSuperlative = function () {
  var comparatives = fs.readFileSync('data/superlatives.json', {encoding: 'utf8'})
  var superlatives = JSON.parse(comparatives).words

  return superlatives[randomIndex(superlatives)].superlative
}

var getOppositeNouns = function () {
  var opposites = fs.readFileSync('data/opposites.json', {encoding: 'utf8'})
  var words = JSON.parse(opposites).opposites
  var selection = words[randomIndex(words)]

  return [selection[0], selection[1]]
}

var createTweet = function () {
  var verb = getVerb()
  var superlative = getSuperlative()
  var opposites = getOppositeNouns()

  // switch up the order of the opposites every now and then
  var flippyfloppy = Date.now() % 2
  var noun = flippyfloppy ? opposites[0] : opposites[1]
  var opposite = flippyfloppy ? opposites[1] : opposites[0]
  var article = ''

  switch (opposite.charAt(0)) {
    case 'a' :
      article = 'an'
      break
    case 'e' :
      article = 'an'
      break
    case 'i' :
      article = 'an'
      break
    case 'o' :
      article = 'an'
      break
    case 'u' :
      article = 'an'
      break
    default :
      article = 'a'
  }

  fs.readFile('data/cities-processed.txt', {encoding: 'utf8'}, function (err, data) {
    if (err) console.log('error grabbing city: ' + err)

    var lines = data.split('\n')
    var city = lines[Math.floor(Math.random() * lines.length)]

    if (verb && superlative && opposites && city) {
      var quote = util.format('The %s %s I ever %s was %s %s in %s.', superlative, noun, verb, article, opposite, city)

      if (quote.length < 141) {
        postTweet(quote)
      }
    }
  })
}

var postTweet = function (quote) {
  var client = new Twitter({
    consumer_key: conf.get('consumer_key'),
    consumer_secret: conf.get('consumer_secret'),
    access_token_key: conf.get('access_token_key'),
    access_token_secret: conf.get('access_token_secret')
  })

  client.post('statuses/update', {status: quote}, function (error, tweet, response) {
    if (error) {
      console.log('error: ' + error + ' ' + response)
    } else {
      console.log('tweeted: ' + tweet)
    }
  })
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
