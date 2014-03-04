# /* Controllers */
angular.module 'BI.controllers'

.controller 'ChartCtrl', ($scope, $http, UserSession, socket) ->
  chart.series[0].data = DATA
  chart.updater = ->
    # set up the updating of the chart from socket
    series = @series[0]
    socket.on 'update_graph', (data) ->
      if data and data.length is 5
        series.addPoint(data, true, true)

  # set initial value
  $scope.chartData = chart

# generate a random data point for the chart
randomBox = (t) ->
  t = t || new Date().getTime()
  open = Math.random() * 20 + 570
  high = Math.random() * 30 + 570
  low = Math.random() * 30 + 570
  close = Math.random() * 20 + 570

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
      upColor: 'rgba(0,200,0,0.6)'

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