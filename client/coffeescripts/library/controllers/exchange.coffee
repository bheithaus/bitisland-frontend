
# Open the Module BI.controllers
angular.module 'BI.controllers'

.controller 'ExchangeCtrl', ($scope, $http, UserSession, socket, selectedCurrency) ->
  $scope.displayCurrency = selectedCurrency.get

  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  $scope.exchanges = [
    { timestamp: 'No Orders on the books', price: 0 }
  ]

  socket.on 'update_pending_book', (data) ->
    # console.log 'heres the order book', data
    if data and data.orders
      $scope.$apply ->
        $scope.exchanges = data.orders

.controller 'CurrencySwitch', ($scope, selectedCurrency, currencyChoices)->
  $scope.display = selectedCurrency.value

  currencyChoices.changed (choices) ->
    $scope.currencies = choices

  $scope.$watch 'selected', (selected, oldSelected) ->

    if selected and (selected.code or currencyChoices.obj[selected.toUpperCase()])

      if selected.code
        selectedCurrency.set selected
      else
        selectedCurrency.set currencyChoices.obj[selected.toUpperCase()]

      $scope.display = selectedCurrency.value