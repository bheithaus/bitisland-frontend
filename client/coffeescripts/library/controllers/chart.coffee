# /* Controllers */
angular.module 'BI.controllers'

.controller 'ChartCtrl', ($scope, $http, UserSession, socket) ->
  chart.series[0].data = DATA
  chart.updater = ->
    # set up the updating of the chart from socket
    series = @series[0]
    socket.on 'update_graph', () ->
      series.addPoint(randomBox(), true, true)

  $scope.chartData = chart

  socket.on 'update_chart', (data) ->
    #console.log 'update with', data


randomBox = (t) ->
  t = t || new Date().getTime()
  open = Math.random() * 2 + 368
  high = Math.random() * 3 + 368
  low = Math.random() * 3 + 368
  close = Math.random() * 2 + 368

  [t, open, high, low, close]

chart =
  title:
    text: 'Live BTI Market Data'
  
  credits: 
    enabled: false

  rangeSelector:
    enabled: false
  
  navigator: 
    enabled: false

  scrollbar:
    enabled: false

  plotOptions:
    candlestick:
      lineColor: 'red'
      upLineColor: 'green'
      upColor: 'green'
      

  series: [{
    name: 'BCI',
    type: 'candlestick',
    data: '',
    tooltip: {
        valueDecimals: 2
      }
    }]

first_stamp = 1317888000000

DATA = []

_(50).times (i) ->
  DATA.push(randomBox(first_stamp + 1000 * i))