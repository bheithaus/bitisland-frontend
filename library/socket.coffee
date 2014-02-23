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
    console.log socket.handshake.decoded_token.email, 'connected'

    address = socket.handshake.address
    client_ip = address.address

    update = () -> 
      if Math.random() > 0.3
        socket.emit 'update_graph'

      routes.orders.get (data) ->
        socket.emit 'update_order_book', data.body


    update()
    setInterval update, 2000