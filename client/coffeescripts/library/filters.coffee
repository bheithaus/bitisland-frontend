# /* Filters */
angular.module 'BI.filters', []

.filter 'exchangeRate', (selectedCurrency) ->
  (price) ->
    ( Number(price * selectedCurrency.value.rate).toFixed(3) )

