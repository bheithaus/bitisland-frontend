# Open the Module BI.controllers
angular.module 'BI.controllers'

.controller 'AccountCtrl', ($scope, $http, UserSession, socket, selectedCurrency) ->
  $scope.displayCurrency = selectedCurrency.value

  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  $scope.exchanges = [
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1134, visible: 20000, tif: 30320 }
  ]   

  socket.on 'update_account_orders', (data) ->
    #NOT YET IMPLEMENTED
    console.log 'heres the account book', data
    if data
      $scope.$apply ->
        $scope.exchanges = data.orders
