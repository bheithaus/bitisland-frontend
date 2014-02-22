gryfter = angular.module 'gryfter', [
  'ui.router'
  'ui.bootstrap'
  'ngCookies'
  'ngResource'
  'gryfter.controllers'
  'gryfter.directives'
  'gryfter.services'
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
  $urlRouterProvider.otherwise '/capture'

.run ['$rootScope', '$state', 'Auth', ($rootScope, $state, Auth) ->
  Auth.monitor()
]