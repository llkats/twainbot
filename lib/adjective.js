module.exports = function getAdjective (callback) {
      wordnikRequest({
        method: 'GET',
        uri: 'words.json/randomWord?includePartOfSpeech=adjective&' + wordnikParams + wordnikKey
      }, function (error, response, body) {
        if (error) console.log(error)

        var adjective = JSON.parse(body)

        callback(null, adjective.word)
      })
    }
