io = require 'socket.io'
socketioJwt = require 'socketio-jwt'
routes = require '../routes'

module.exports = (server) ->
  # socket.io
  io = io.listen server
  io.set 'log level', 1

  io.set 'authorization', socketioJwt.authorize 
    secret: config.JWT_Token,
    handshake: true

  # New client joining
  io.sockets.on 'connection', (socket) ->
    #console.log socket.handshake.decoded_token.email, 'connected'

    address = socket.handshake.address
    client_ip = address.address

    # aggregate data here
    aggregate = (data, cb) ->
      aggregated = {}

      #console.log 'aggregate this somehow...', data
      for order, i in data.orders
        if i is 0
          aggregated.high = order.price
          aggregated.low = order.price
          aggregated.close = order.price

        if i is data.orders.length - 1
          aggregated.open = order.price

        if order.price > aggregated.high
          aggregated.high = order.price

        if order.price < aggregated.low
          aggregated.low = order.price

        cb aggregated



    update = () -> 
      if Math.random() > 0.3
        socket.emit 'update_graph'

      routes.orders.pending (data) ->
        socket.emit 'update_pending_book', data.body

      
      routes.orders.completed (data) ->
        socket.emit 'update_completed_book', data.body

        aggregate data.body, (result) ->
          socket.emit 'update_chart', result

      routes.orders.ticker (data) ->
        socket.emit 'update_ticker', data.body

    update()
    setInterval update, 2000

