# /* Controllers */
angular.module 'BI.controllers'

.controller 'LogoutCtrl', ($scope, $http, Auth, $state) ->
  Auth.logout () ->
    $state.transitionTo 'home'
