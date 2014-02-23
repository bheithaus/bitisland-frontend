routes = require './routes'
library = require './library'
unirest = require 'unirest'

middleware = library.middleware


module.exports = (app) ->
  app.get '/',             routes.index
  app.get '/partials/(*)', routes.partial


  app.post '/register', library.authentication.register


  app.post '/api/orders', routes.orders.create

  app.del '/api/orders', (req, res) ->
    console.log 'cancel all orders', req.body
    res.json { ok: true }


  # session
  app.get  '/authentication', library.authentication.session
  app.post '/authentication', library.authentication.login
  app.del  '/authentication', library.authentication.logout
  
  app.get '/api/list', (req, res) ->
    console.log 'test'
    res.send 200

  # angularJS Entry point
  app.get '*', routes.index

