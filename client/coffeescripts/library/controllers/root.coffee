# /* Controllers */
angular.module 'BI.controllers'

#root scope Controller
.controller 'AppCtrl', ($scope, $location, LoginModal, RegisterModal, UserSession, Auth, $state) ->
  # handle login modal error here

  $scope.logout = ->
    Auth.logout ->
      $state.transitionTo 'home'

  $scope.login = LoginModal.open
  $scope.register = RegisterModal.open

  $scope.loggedIn = ->
    UserSession.loggedIn()

  $scope.user = UserSession


  $scope.color = 'dark'
  $scope.toggleColor = ->
    $scope.color = if $scope.color is 'dark' then 'light' else 'dark'
    console.log 'color', $scope.color
