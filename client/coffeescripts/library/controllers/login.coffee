# /* Controllers */
angular.module 'BI.controllers'

.controller 'LoginInstanceCtrl', ($scope, $modalInstance, Auth, $state) ->
  $scope.user = {}

  $scope.login = () ->
    Auth.login 'password', $scope.user, (error) ->
      if not error
        $modalInstance.dismiss()
        $state.transitionTo 'trade'
      else 
        $scope.error = error

  $scope.cancel = () ->
    $modalInstance.dismiss 'cancel'

  $scope.guestLogin = () ->
  	Auth.login 'password',
      name: 'guest'
      password: 'guest'
    , (error) ->
      if not error
        $modalInstance.dismiss()
        $state.transitionTo 'trade'
      else 
        $scope.error = error

.controller 'LoginCtrl', (LoginModal) ->  
  LoginModal.open()
