# /* Controllers */
angular.module 'BI.controllers'

.controller 'OrderCtrl', ($scope, Order, currentOrder, selectedCurrency) ->
  # Default

  $scope.orderType = 'market' 
  $scope.orderTypes = [
    'market'
    'limit'
    'sell_short'
    'stop'
    'iceberg'
    'hidden'
  ]

  $scope.tif = 'day'
  $scope.tifTypes = [
    'day'
    'gtc'
    'fok'
    'tif'
  ]

  $scope.market = 'bti'
  $scope.marketTypes = [
    'bti'
    'mtgox'
    'bitstamp'
    'btce'
  ]

  $scope.displayCurrency = selectedCurrency.value

  selectedCurrency.change () ->
    $scope.displayCurrency = selectedCurrency.value

  # act on shared service
  setOrder = () ->
    currentOrder.set
      type: $scope.orderType
      price: $scope.price
      quantity: $scope.quantity
      visible: $scope.visible
      tif: $scope.tif
      market: $scope.market

  # save shared devices
  for prop in ['price','orderType','quantity','tif','market', 'visible']
    $scope.$watch prop, setOrder

  $scope.$watch 'quantity', (val) ->
    $scope.visible = val if not $scope.visibleEdited

  $scope.editVisible = ->
    $scope.visibleEdited = true

  # select active type
  $scope.selected = (type) ->
    $scope.orderType = type

  # return boolean, which type is active
  $scope.active = (type) ->
    if $scope.orderType is type
    then true
    else false


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


