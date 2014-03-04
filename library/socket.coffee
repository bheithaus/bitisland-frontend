io = require 'socket.io'
socketioJwt = require 'socketio-jwt'
routes = require '../routes'

# aggregate data here
aggregate = (data, cb) ->
  aggregated = {}

  #console.log 'aggregate this somehow...', data
  if data and data.orders
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

    cb [
      new Date().getTime()
      aggregated.open
      aggregated.high
      aggregated.low
      aggregated.close
    ]


module.exports = (server) ->
  intervalID = null
  # socket.io
  io = io.listen server
  io.set 'log level', 1

  io.set 'authorization', socketioJwt.authorize 
    secret: config.JWT_Token,
    handshake: true

  # New client joining
  io.sockets.on 'connection', (socket) ->
    #console.log socket.handshake.decoded_token.email, 'connected'

    _connected = io.sockets.clients().filter((socket) -> socket isnt null).length

    socket.on 'disconnect', () ->
      _connected = io.sockets.clients().filter((socket) -> socket isnt null).length

    address = socket.handshake.address
    client_ip = address.address

    update = () ->
      return clearInterval intervalID if not _connected

      routes.orders.pending (data) ->
        io.sockets.emit 'update_pending_book', data.body
      
      routes.orders.completed (data) ->
        io.sockets.emit 'update_completed_book', data.body

        aggregate data.body, (result) ->
          io.sockets.emit 'update_graph', result

      routes.orders.ticker (data) ->
        io.sockets.emit 'update_ticker', data.body

    update()
    clearInterval intervalID
    intervalID = setInterval update, 2000

