var fs = require('fs')
var split = require('split')
var through = require('through')

var fields = [
    'id',
    'name',
    'asciiname',
    'alternativeNames',
    'lat',
    'lon',
    'featureClass',
    'featureCode',
    'country',
    'altCountry',
    'adminCode',
    'countrySubdivision',
    'municipality',
    'municipalitySubdivision',
    'population',
    'elevation',
    'dem',
    'tz',
    'lastModified'
]

fs.createReadStream('./cities1000-copy.txt')
  .pipe(split())
  .pipe(through(function (line) {
    var row = line.split('\t').reduce(function (acc, x, ix) {
      var key = fields[ix]
      if (key === 'alternativeNames') x = x.split(',')
      if (key === 'lat' || key === 'lon') x = parseFloat(x)
      if (key === 'elevation') x = x ? parseInt(x, 10) : undefined
      if (key === 'population') x = x ? parseInt(x, 10) : undefined

      acc[key] = x
      return acc
    }, {})
    if (!row.id || row.population < 800000) return

    var text = row.name + '\n'

    fs.appendFile('data/cities-processed.txt', text, function (err) {
      if (err) {
        console.log(err, 'err')
      }

      console.log(row.name)
    })

  })
  )
