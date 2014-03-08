module.exports =
  partial: require './partial'

  orders: require './orders'

  index: (req, res) ->
    res.render 'index', { 
      title: 'BitIsland'
      user: req.user
      dependencies:
        scripts: config.dependencies.scripts()
    }

