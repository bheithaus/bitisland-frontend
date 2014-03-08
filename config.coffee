module.exports = (app) ->
  env = app.get('env')

  # return 
  db: 'mongodb://localhost/bitisland-dev'
  JWT_Token: 'SUPER_SECRET_TOKEN'
  dependencies:
    scripts: ->
      min = if env is 'production'
      then '.min'
      else ''

      [
        "http://code.angularjs.org/1.2.2/angular#{min}.js"
        "/javascripts/vendor#{min}.js"
        "/socket.io/socket.io.js"
        "http://code.highcharts.com/stock/highstock.js"
        "/javascripts/index.js"
      ]