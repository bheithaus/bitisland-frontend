# Open the Module BI.controllers
angular.module 'BI.controllers'

.controller 'TickerCtrl', ($scope, $http, UserSession, socket, selectedCurrency, LatestTrade) ->
  $scope.displayCurrency = selectedCurrency.value
  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  $scope.up = (price) ->
    price >= $scope.latestPrice

  $scope.ticker = 
    ask: 0
    bid: 0
    last_trade: 0

  # track the price of the latest trade
  $scope.$watch LatestTrade.get, (val) ->
    if val
      $scope.latestPrice = val

  # ticker update
  socket.on 'update_ticker', (data) ->
    if data
      $scope.$apply ->
        for key, val of data
          if val and typeof val.price is 'number'
            $scope.ticker[key] = val.price
          else if typeof val is 'number'
            $scope.ticker[key] = val

  socket.on 'update_completed_book', (data) ->
    #console.log 'data', data
    if data and data.orders
      #console.log ''
      $scope.$apply () ->
        $scope.orders = data.orders