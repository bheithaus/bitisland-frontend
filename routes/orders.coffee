utils = require 'lodash'
unirest = require 'unirest'

ORDER = 
  base: 'http://ec2-23-20-198-215.compute-1.amazonaws.com/'
  defaults:
    symbol: 'bitcoin'
    market: 'bti'
    tif: 'day'
    price: 0

fakeData = ->
  timestamp: new Date().getTime()
  position: if Math.random() > 0.5 then 'buy' else 'sell'
  visible: if Math.random() > 0.3 then Math.floor(Math.random() * 2000) else 0
  price: Math.random() * 50 + 560
  tif: 'tif'
  market: 'BTI'

handleBrokenBackend = (callback, type) ->
  (data) ->
    if data.error
      # insert test data
      if type is 'ticker'
        data = 
          body:
            ask: Math.random() * 50 + 570
            bid: Math.random() * 50 + 570
            last_trade: Math.random() * 50 + 570
      else
        data = 
          body:
            orders: []

        utils(15).times () ->
          data.body.orders.push fakeData()
    
    callback data


module.exports =
  pending: (callback) ->
    unirest.get ORDER.base + 'latest_orders'
      .end handleBrokenBackend(callback)

  completed: (callback) ->
    unirest.get ORDER.base + 'completed_orders'
      .end handleBrokenBackend(callback)

  ticker: (callback) ->
    unirest.get ORDER.base + 'ticker'
      .end handleBrokenBackend(callback, 'ticker')

  create: (req, res) ->
    # create new order { type: 'market', quantity: 100, position: 'buy' }
    order = {}

    if req.body.type == 'market'
      delete req.body.price

    if req.body.type == 'hidden'
      req.body.visible = 0

    order = utils.extend(order, ORDER.defaults, req.body, { userid: req.user.id })

    console.log 'submitting order ', order

    unirest.get ORDER.base + 'new_order'
      .query order
      .end (data) ->
        console.log 'response from flask', data.body



    res.json { ok: true }