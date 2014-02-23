BI = angular.module 'BI', [
  'ui.router'
  'ui.bootstrap'
  'ui.bootstrap.typeahead'
  'ngCookies'
  'ngResource'
  'BI.controllers'
  'BI.directives'
  'BI.services'
  'BI.filters'
]

.config ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) ->
  $httpProvider.interceptors.push 'authInterceptor'

  # html location
  $locationProvider.html5Mode true

  $stateProvider
    .state 'home',
      url: '/'
      templateUrl: 'partials/home'
      controller: 'HomeCtrl'

    .state 'trade',
      url: '/trade'
      templateUrl: 'partials/trade'
      controller: 'TradeCtrl'
      authenticate: true

    .state 'login',
      # templateUrl: 'partials/session/login'
      controller: 'LoginCtrl'

    .state 'logout',
      url: '/logout'
      controller: 'LogoutCtrl'

  # For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise '/'

.run ['$rootScope', '$state', 'Auth', ($rootScope, $state, Auth) ->
  Auth.monitor()
]