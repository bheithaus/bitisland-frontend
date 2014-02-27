# Open the Module BI.controllers
angular.module 'BI.controllers'

.controller 'AccountCtrl', ($scope, $http, UserSession, socket, selectedCurrency, LatestTrade) ->
  $scope.displayCurrency = selectedCurrency.value
  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  $scope.up = (price) ->
    price >= $scope.latestPrice


  $scope.exchanges = [
    { timestamp: 'LOADING....' }
  ]

  socket.on 'update_completed_book', (data) ->
    #console.log 'heres the completed order book', data

    if data and data.orders
      $scope.$apply ->
        $scope.latestPrice = 0
        i = 0

        until $scope.latestPrice or i is data.orders.length
          $scope.latestPrice = data.orders[i].price
          i++

        LatestTrade.set $scope.latestPrice

        $scope.exchanges = data.orders[0..4]
        
