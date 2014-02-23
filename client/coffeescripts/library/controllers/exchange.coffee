
# Open the Module BI.controllers
angular.module 'BI.controllers'

.controller 'ExchangeCtrl', ($scope, $http, UserSession, socket, selectedCurrency) ->
  $scope.displayCurrency = selectedCurrency.get

  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  $scope.exchanges = [
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1200, visible: 20000, tif: 30320 }
    { timestamp: 'thurs 2014', position: 'buy', price: 1134, visible: 20000, tif: 30320 }
  ]

  socket.on 'update_order_book', (data) ->
    console.log 'heres the order book', data
    if data
      $scope.$apply ->
        $scope.exchanges = data.orders

.controller 'CurrencySwitch', ($scope, selectedCurrency, currencyChoices)->
  $scope.display = selectedCurrency.value

  currencyChoices.changed (choices) ->
    $scope.currencies = choices

  $scope.$watch 'selected', (selected, oldSelected) ->
    console.log 'selected', selected, oldSelected
    if selected and (selected.code or currencyChoices.obj[selected.toUpperCase()])
      console.log 'passed test', selected
      if selected.code
        selectedCurrency.set selected
      else
        selectedCurrency.set currencyChoices.obj[selected.toUpperCase()]

      $scope.display = selectedCurrency.value
