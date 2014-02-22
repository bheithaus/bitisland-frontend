# Services
# 
angular.module 'gryfter.services'

.factory 'Session', ($resource) ->
  $resource '/authentication'

.factory 'User', ($resource) ->
  $resource '/register'

.service 'UserSession', (Session, $cookieStore, $window) ->
  current = $window.sessionStorage.token
  
  user = 
    login: (user) ->
      $window.sessionStorage.token = user.token
      current = user.token

    logout: ->
      delete $window.sessionStorage.token
      current = null

    loggedIn: ->
      current

.factory 'Auth', ($rootScope, Session, UserSession, $state, LoginModal, User) ->
  login: (provider, user, callback) ->
    if typeof callback isnt 'function'
      callback = angular.noop

    Session.save
      provider: provider
      name: user.name
      password: user.password
    , (data) ->
      if not data.error
        # success
        UserSession.login data
        callback()
      else 
        UserSession.logout()
        callback(data.error)

  create: (user, callback) ->
    if typeof callback isnt 'function'
      callback = angular.noop

    User.save user, (data) ->
      UserSession.login data if not data.errors

      callback(data.errors)

  logout: (callback) ->
    if typeof callback isnt 'function'
      callback = angular.noop

    Session.remove () ->
      UserSession.logout()
      callback()

  monitor: () ->
    $rootScope.$on '$stateChangeStart', (event, current, prev) ->
      if current.authenticate and not UserSession.loggedIn()
        # User isn’t authenticated
        $state.transitionTo 'home'
        LoginModal.open()
        event.preventDefault()

.factory 'authInterceptor', ($rootScope, $q, $window, $location) ->
  request: (config) ->
    config.headers = config.headers or {}
    if $window.sessionStorage.token
      config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
    
    config

  responseError: (response) ->
    if response.status is 401
      $location.path '/'

    response or $q.when response

