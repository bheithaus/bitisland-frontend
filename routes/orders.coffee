utils = require 'lodash'
unirest = require 'unirest'

ORDER = 
  base: 'http://ec2-23-20-198-215.compute-1.amazonaws.com/'
  defaults:
    symbol: 'bitcoin'
    market: 'bti'
    tif: 'day'
    price: 0

module.exports =
  pending: (callback) ->
    unirest.get ORDER.base + 'latest_orders'
      .end callback

  completed: (callback) ->
    unirest.get ORDER.base + 'completed_orders'
      .end callback

  ticker: (callback) ->
    unirest.get ORDER.base + 'ticker'
      .end callback

  create: (req, res) ->
    # create new order { type: 'market', quantity: 100, position: 'buy' }
    order = {}

    console.log 'from frontend', req.body

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