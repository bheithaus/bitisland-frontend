# Open the Module BI.controllers
angular.module 'BI.controllers'

.controller 'AccountCtrl', ($scope, $http, UserSession, socket, selectedCurrency) ->
  $scope.displayCurrency = selectedCurrency.value

  $scope.up = (price) ->
    price >= $scope.latestPrice

  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  $scope.exchanges = [
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1134, visible: 20000, tif: 30320 }
  ]

  socket.on 'update_completed_book', (data) ->
    console.log 'heres the completed order book', data

    if data and data.orders and data.orders.length
      $scope.$apply ->
        $scope.latestPrice = null
        i = 0
        until $scope.latestPrice or i is data.orders.length
          $scope.latestPrice = data.orders[i].price
          i++

        $scope.exchanges = data.orders[0..6]
        

