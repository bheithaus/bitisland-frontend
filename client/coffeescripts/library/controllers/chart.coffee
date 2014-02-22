# /* Controllers */
angular.module 'gryfter.controllers'

.controller 'ChartCtrl', ($scope, $http, UserSession, socket) ->
  chart.series[0].data = DATA
  chart.updater = ->
    # set up the updating of the chart from socket
    series = @series[0]
    socket.on 'update_graph', () ->
      series.addPoint(randomBox(), true, true)

  $scope.chartData = chart
  socket.on('connect', () ->

  ).on('disconnect', () ->
    console.log('disconnected');
  )

randomBox = (t) ->
  t = t || new Date().getTime()
  open = Math.random() * 5 + 370
  high = Math.random() * 8 + 368
  low = Math.random() * 8 + 368
  close = Math.random() * 5 + 370

  [t, open, high, low, close]

chart =
  title:
    text: 'AAPL stock price by minute'
  
  credits: 
    enabled: false

  rangeSelector:
    enabled: false
  
  navigator: 
    enabled: false

  scrollbar:
    enabled: false

  series: [{
    name: 'AAPL',
    type: 'candlestick',
    data: '',
    tooltip: {
        valueDecimals: 2
      }
    }]

first_stamp = 1317888000000

DATA = [
  [1317888000000,372.5101,375,372.2,372.52],
]

_(100).times (i) ->
  DATA.push(randomBox(first_stamp + 1000 * i))