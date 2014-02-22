# /* Controllers */
angular.module 'gryfter.controllers'

#root scope Controller
.controller 'AppCtrl', ($scope, $location, LoginModal, RegisterModal, UserSession) ->
  # handle login modal error here

  $scope.login = LoginModal.open
  $scope.register = RegisterModal.open

  $scope.errors = $location.search().incorrect
  $scope.loggedIn = ->
    UserSession.loggedIn()

  $scope.user = UserSession


