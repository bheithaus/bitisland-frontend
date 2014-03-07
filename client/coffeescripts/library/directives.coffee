'use strict'

# /* Directives */
angular.module 'BI.directives', []

# TODO, I would like to open source this (maybe just as a GIST)
.directive 'savedForm', ($timeout) ->
  scope:
    formData: '='

  link: ($scope, element, attrs) ->
    $timeout () -> 
      inputs = element.find 'input'

      for input in inputs
        input = angular.element input
        type = input.attr 'type' 
        if type is 'text' or type is 'password'
          $scope.formData[input.attr 'name'] = input.val()

      $scope.$apply()
    , 100

.directive 'positiveNumber',  ->
  link: ($scope, elm, attrs, ctrl) ->
    $scope.$watch attrs.ngModel, (newVal) ->
      $scope[attrs.ngModel] = 0 if newVal < 0

.directive 'chart', ->
  restrict: 'E'
  template: '<div></div>'
  scope: { chartData: "=value" }
  transclude: true
  replace: true

  link:  ($scope, element, attrs) ->
    chartDefaults =
      chart:
        renderTo: element[0]
        type: attrs.type || null
        height: attrs.height || null
        width: attrs.width || null

      colors: [
        'rgba(200,0,0,0.6)'
      ]

    updateChart = (value) ->
      console.log 'update Chart'
      return if not value

      # handle live updating
      updater = $scope.chartData.updater
      delete $scope.chartData.updater

      newSettings = {}
      angular.extend(newSettings, chartDefaults, $scope.chartData)

      if updater
        newSettings.chart.events = 
          load: updater
      
      chart = new Highcharts.StockChart newSettings
      

    # on color change
    $scope.$watch (-> attrs.color), (color) ->
      chartDefaults.chart.backgroundColor = if color is 'light' then 'white' else 'black'
      updateChart($scope.chartData)

    # Update when charts data changes
    # $scope.$watch (-> $scope.chartData), updateChart


.directive 'resizable', ($window) ->
  link: ($scope, $element) ->
    $scope.initializeElementSize = ->
      $scope.elementHeight = $element.innerHeight
      $scope.elementWidth  = $element.innerWidth

    $scope.initializeElementSize()

    angular.element($window).bind 'resize', ->
      $scope.initializeElementSize()
      $scope.$apply()



.directive 'tagManager', ->
    restrict: 'E'
    scope: { tags: '=' }
    template:
      '<div class="tags">' +
          '<a ng-repeat="(idx, tag) in tags" class="tag" ng-click="remove(idx)">{{tag}}</a>' +
      '</div>' +
      '<input type="text" placeholder="Add a tag..." ng-model="new_value"></input> ' +
      '<a class="btn" ng-click="add()">Add</a>'

    link: ( $scope, $element ) ->
      # // FIXME: this is lazy and error-prone
      input = angular.element( $element.children()[1] );

      # // This adds the new tag to the tags array
      $scope.add = () ->
        $scope.tags.push( $scope.new_value );
        $scope.new_value = "";
      
      
      # // This is the ng-click handler to remove an item
      $scope.remove =  ( idx ) ->
        $scope.tags.splice( idx, 1 );
    
      
      # // Capture all keypresses
      input.bind( 'keypress',  ( event ) ->
          # // But we only care when Enter was pressed
          if ( event.keyCode == 13 )
              # // There's probably a better way to handle this...
              $scope.$apply( $scope.add );
          
      )