unirest = require 'unirest'
updateURL = ''

module.exports = 
  start: ->
    update = ->
      http.get updateURL
        .end (data) ->

    console.log 'time to aggregate'
