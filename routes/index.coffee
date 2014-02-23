module.exports =
  partial: require './partial'

  orders: require './orders'

  index: (req, res) ->
    res.render 'index', { 
      title: 'Express'
      user: req.user
    }

