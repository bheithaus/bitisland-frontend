utils = require 'lodash'
unirest = require 'unirest'

ORDER = 
  base: 'http://ec2-23-20-198-215.compute-1.amazonaws.com/'
  defaults:
    symbol: 'bitcoin'
    market: 'bti'
    visible: 250
    tif: 'day'
    price: 0

module.exports = 
  get: (callback) ->
    unirest.get ORDER.base + 'latest_orders'
      .end (data) ->
        # console.log 'response from flask', data.body
        callback data

  create: (req, res) ->
    # create new order { type: 'market', quantity: 100, position: 'buy' }
    order = {}
    order = utils.extend(order, ORDER.defaults, req.body, { userid: req.user.id })

    unirest.get ORDER.base + 'new_order'
      .query order
      .end (data) ->
        console.log 'response from flask', data.body



    res.json { ok: true }
