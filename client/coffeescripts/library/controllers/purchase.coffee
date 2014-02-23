# /* Controllers */
angular.module 'BI.controllers'

.controller 'OrderCtrl', ($scope, Order, currentOrder, selectedCurrency) ->
  # Default
  $scope.activeOrderType = 'market' 
  
  $scope.displayCurrency = selectedCurrency.value

  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  # act on shared service
  setOrder = () ->
    currentOrder.set
      type: $scope.activeOrderType
      price: $scope.price
      quantity: $scope.quantity

  $scope.$watch 'price', setOrder 
  $scope.$watch 'type', setOrder
  $scope.$watch 'quantity', setOrder 

  # focus active type
  $scope.focus = (type) ->
    $scope.activeOrderType = type

  # return boolean, which type is active
  $scope.activeOrder = (type) ->
    if $scope.activeOrderType isnt type
    then 'disabled'
    else ''


.controller 'PurchaseCtrl', ($scope, $http, Order, currentOrder) ->
  $scope.cancel = ->
    $http.delete '/api/orders'
    .success (data) ->
      console.log 'data', data
    .error (data) ->
      console.error 'data', data

  $scope.order = (type) ->
    order = angular.extend currentOrder.get(), { position: type }
    console.log 'order', order
    return if not order.quantity
    return if order.type is 'limit' and not order.price

    Order.save order
    , (data) ->
      if not data.error
        console.log 'successful order'

      console.log 'execute market order'



