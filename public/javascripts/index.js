window.myapp_constants = {
  some_url: 'http://www.example.com'
};

angular.module('gryfter.controllers', []);

var DATA, chart;

angular.module('gryfter.controllers').controller('ChartCtrl', function($scope, $http) {
  chart.series[0].data = DATA;
  $scope.chartData = chart;
  return console.log($scope.chartData);
});

chart = {
  title: {
    text: 'AAPL stock price by minute'
  },
  credits: {
    enabled: false
  },
  rangeSelector: {
    enabled: false
  },
  navigator: {
    enabled: false
  },
  scrollbar: {
    enabled: false
  },
  series: [
    {
      name: 'AAPL',
      type: 'candlestick',
      data: '',
      tooltip: {
        valueDecimals: 2
      }
    }
  ]
};

DATA = [[1317888000000, 372.5101, 375, 372.2, 372.52], [1317888060000, 372.4, 373, 372.01, 372.16], [1317888120000, 372.16, 372.4, 371.39, 371.62], [1317888180000, 371.62, 372.16, 371.55, 371.75], [1317888240000, 371.75, 372.4, 371.57, 372], [1317888300000, 372, 372.3, 371.8, 372.24], [1317888360000, 372.22, 372.45, 372.22, 372.3], [1317888420000, 372.3, 373.25, 372.3, 373.15], [1317888480000, 373.01, 373.5, 373, 373.24], [1317888540000, 373.36, 373.88, 373.19, 373.88], [1317888600000, 373.8, 374.34, 373.75, 374.29], [1317888660000, 374.29, 374.43, 374, 374.01], [1317888720000, 374.05, 374.35, 373.76, 374.35], [1317888780000, 374.41, 375.24, 374.37, 374.9], [1317888840000, 374.83, 375.73, 374.81, 374.96], [1317888900000, 374.81, 375.4, 374.81, 375.25], [1317888960000, 375.2, 375.7, 375.14, 375.19], [1317889020000, 375.43, 375.43, 374.75, 374.76], [1317889080000, 374.94, 375.5, 374.81, 375.13], [1317889140000, 375.12, 375.48, 375, 375.04], [1317889200000, 375.24, 375.24, 375, 375.08], [1317889260000, 375.16, 375.16, 374.51, 374.51], [1317889320000, 374.51, 374.75, 374.2, 374.27], [1317889380000, 374.22, 374.55, 373.83, 374.55], [1317889440000, 374.69, 374.86, 374.01, 374.2], [1317889500000, 374.32, 374.65, 374.31, 374.51], [1317889560000, 374.65, 375.12, 374.51, 375.12], [1317889620000, 375.13, 375.25, 374.83, 375.22], [1317889680000, 375.16, 375.22, 375, 375], [1317889740000, 375, 375, 374.66, 374.8], [1317889800000, 374.88, 375, 374.5, 374.85], [1317889860000, 374.41, 374.67, 374.25, 374.67], [1317889920000, 374.5, 374.75, 374.27, 374.42], [1317889980000, 374.4, 374.93, 374.38, 374.85], [1317890040000, 374.86, 375.3, 374.8, 375.09], [1317890100000, 375, 375.18, 374.9, 375.02], [1317890160000, 375.02, 375.08, 374.86, 374.87], [1317890220000, 374.93, 375.75, 374.93, 375.75], [1317890280000, 375.75, 376.5, 375.75, 376.31], [1317890340000, 376.31, 377.2, 376.19, 377.04], [1317890400000, 377.2, 377.33, 376.45, 376.47], [1317890460000, 376.75, 376.99, 376.53, 376.54], [1317890520000, 376.54, 376.67, 376.08, 376.35], [1317890580000, 376.41, 376.94, 376.2, 376.5], [1317890640000, 376.46, 376.51, 376.06, 376.09], [1317890700000, 376.38, 376.84, 376.09, 376.78], [1317890760000, 376.55, 376.6, 376.41, 376.44], [1317890820000, 376.45, 376.87, 376.31, 376.87], [1317890880000, 376.83, 377, 376.63, 376.95], [1317890940000, 376.95, 377, 376.1, 376.1], [1317891000000, 376.1, 376.17, 375.64, 375.65], [1317891060000, 375.68, 376.05, 375.32, 376.05], [1317891120000, 376.03, 376.04, 375.5, 375.72], [1317891180000, 375.83, 376.195, 375.7, 376], [1317891240000, 376.01, 376.6, 376, 376.5], [1317891300000, 376.5, 376.53, 376.11, 376.21], [1317891360000, 376.17, 376.3, 376.1, 376.25], [1317891420000, 376.4, 376.4, 376.13, 376.29], [1317891480000, 376.15, 376.39, 376.1, 376.39], [1317891540000, 376.4, 377.11, 376.4, 377], [1317891600000, 377.01, 377.15, 376.79, 377.15], [1317891660000, 377.02, 377.15, 376.55, 376.88], [1317891720000, 376.67, 376.76, 376.52, 376.53], [1317891780000, 376.78, 376.91, 376.53, 376.82], [1317891840000, 376.73, 376.86, 376.7, 376.75], [1317891900000, 376.7, 376.71, 376.5, 376.57], [1317891960000, 376.53, 376.74, 376.2, 376.2], [1317892020000, 376.17, 376.17, 375.91, 376], [1317892080000, 376, 376, 375.77, 375.77]];

angular.module('gryfter.controllers').controller('HomeCtrl', function($scope, $http, $location, LoginModal, User) {
  return $scope.name = 'hey derr';
});

angular.module('gryfter.controllers').controller('ListCtrl', function($scope, $http, $location, LoginModal, User) {
  $http.get('/api/list').success(function() {
    return console.log('ars', arguments);
  });
  return $scope.entities = [
    {
      name: 'one'
    }, {
      name: 'two'
    }
  ];
});

angular.module('gryfter.controllers').controller('LoginInstanceCtrl', function($scope, $modalInstance, Auth, $state) {
  $scope.user = {};
  $scope.login = function() {
    return Auth.login('password', {
      name: $scope.user.name,
      password: $scope.user.password
    }, function(error) {
      if (!error) {
        $modalInstance.dismiss();
        return $state.transitionTo('home');
      } else {
        return $scope.error = error;
      }
    });
  };
  return $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
}).controller('LoginCtrl', function(LoginModal) {
  return LoginModal.open();
});

angular.module('gryfter.controllers').controller('LogoutCtrl', function($scope, $http, Auth, $state) {
  return Auth.logout(function() {
    return $state.transitionTo('home');
  });
});

angular.module('gryfter.controllers').controller('RegisterInstanceCtrl', function($scope, $modalInstance, $state, Auth) {
  $scope.user = {};
  $scope.register = function() {
    return Auth.create($scope.user, function(errors) {
      var error, field, _results;
      if (!errors) {
        $modalInstance.dismiss();
        return $state.transitionTo('home');
      } else {
        _results = [];
        for (field in errors) {
          error = errors[field];
          _results.push($scope[field + '_error'] = error);
        }
        return _results;
      }
    });
  };
  return $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
}).controller('LoginCtrl', function(LoginModal) {
  return LoginModal.open();
});

angular.module('gryfter.controllers').controller('AppCtrl', function($scope, $location, LoginModal, RegisterModal, UserSession) {
  $scope.login = LoginModal.open;
  $scope.register = RegisterModal.open;
  $scope.errors = $location.search().incorrect;
  $scope.loggedIn = function() {
    return UserSession.loggedIn();
  };
  return $scope.user = UserSession;
});

angular.module('gryfter.controllers').controller('TradeCtrl', function($scope, $http, $location, LoginModal, User) {
  return $scope.name = 'hey derr';
});

angular.module('gryfter.services', []);

angular.module('gryfter.services').factory('LoginModal', function($modal, $log) {
  return {
    open: function() {
      var modalInstance;
      return modalInstance = $modal.open({
        templateUrl: 'partials/session/login',
        controller: 'LoginInstanceCtrl'
      });
    }
  };
}).factory('RegisterModal', function($modal, $log) {
  return {
    open: function() {
      var modalInstance;
      return modalInstance = $modal.open({
        templateUrl: 'partials/session/register',
        controller: 'RegisterInstanceCtrl'
      });
    }
  };
});

angular.module('gryfter.services').factory('Session', function($resource) {
  return $resource('/authentication');
}).factory('User', function($resource) {
  return $resource('/register');
}).service('UserSession', function(Session, $cookieStore, $window) {
  var current, user;
  current = $window.sessionStorage.token;
  return user = {
    login: function(user) {
      $window.sessionStorage.token = user.token;
      return current = user.token;
    },
    logout: function() {
      delete $window.sessionStorage.token;
      return current = null;
    },
    loggedIn: function() {
      return current;
    }
  };
}).factory('Auth', function($rootScope, Session, UserSession, $state, LoginModal, User) {
  return {
    login: function(provider, user, callback) {
      if (typeof callback !== 'function') {
        callback = angular.noop;
      }
      return Session.save({
        provider: provider,
        name: user.name,
        password: user.password
      }, function(data) {
        if (!data.error) {
          UserSession.login(data);
          return callback();
        } else {
          UserSession.logout();
          return callback(data.error);
        }
      });
    },
    create: function(user, callback) {
      if (typeof callback !== 'function') {
        callback = angular.noop;
      }
      return User.save(user, function(data) {
        if (!data.errors) {
          UserSession.login(data);
        }
        return callback(data.errors);
      });
    },
    logout: function(callback) {
      if (typeof callback !== 'function') {
        callback = angular.noop;
      }
      return Session.remove(function() {
        UserSession.logout();
        return callback();
      });
    },
    monitor: function() {
      return $rootScope.$on('$stateChangeStart', function(event, current, prev) {
        if (current.authenticate && !UserSession.loggedIn()) {
          $state.transitionTo('home');
          LoginModal.open();
          return event.preventDefault();
        }
      });
    }
  };
}).factory('authInterceptor', function($rootScope, $q, $window, $location) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/');
      }
      return response || $q.when(response);
    }
  };
});

'use strict';
angular.module('gryfter.directives', []).directive('gryft', function() {
  return {
    restrict: 'A',
    scope: {
      meta: '='
    },
    template: '<h4>{{creator}}</h4>' + '<span class="price">{{price}}</span>' + '<img class="img-rounded col-xs-12 clearfix" src="{{src}}"/>',
    link: function($scope, element, attrs) {
      var meta;
      meta = $scope.meta;
      if (meta._id) {
        $scope.src = "" + gryfter_constants.gryft_base + meta._id + ".jpg";
        $scope.creator = meta.creator;
        return $scope.price = meta.price || 'no price';
      }
    }
  };
}).directive('chart', function() {
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {
      chartData: "=value"
    },
    transclude: true,
    replace: true,
    link: function($scope, element, attrs) {
      var chartsDefaults;
      chartsDefaults = {
        chart: {
          renderTo: element[0],
          type: attrs.type || null,
          height: attrs.height || null,
          width: attrs.width || null
        }
      };
      return $scope.$watch((function() {
        return $scope.chartData;
      }), function(value) {
        var chart, newSettings;
        if (!value) {
          return;
        }
        newSettings = {};
        angular.extend(newSettings, chartsDefaults, $scope.chartData);
        console.log(newSettings);
        return chart = new Highcharts.StockChart(newSettings);
      });
    }
  };
}).directive('tagManager', function() {
  return {
    restrict: 'E',
    scope: {
      tags: '='
    },
    template: '<div class="tags">' + '<a ng-repeat="(idx, tag) in tags" class="tag" ng-click="remove(idx)">{{tag}}</a>' + '</div>' + '<input type="text" placeholder="Add a tag..." ng-model="new_value"></input> ' + '<a class="btn" ng-click="add()">Add</a>',
    link: function($scope, $element) {
      var input;
      input = angular.element($element.children()[1]);
      $scope.add = function() {
        $scope.tags.push($scope.new_value);
        return $scope.new_value = "";
      };
      $scope.remove = function(idx) {
        return $scope.tags.splice(idx, 1);
      };
      return input.bind('keypress', function(event) {
        if (event.keyCode === 13) {
          return $scope.$apply($scope.add);
        }
      });
    }
  };
});

angular.module('myApp.filters', []).filter('interpolate', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
});

var gryfter;

gryfter = angular.module('gryfter', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngResource', 'gryfter.controllers', 'gryfter.directives', 'gryfter.services']).config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $locationProvider.html5Mode(true);
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'partials/home',
    controller: 'HomeCtrl'
  }).state('trade', {
    url: '/trade',
    templateUrl: 'partials/trade',
    controller: 'TradeCtrl',
    authenticate: true
  }).state('login', {
    controller: 'LoginCtrl'
  }).state('logout', {
    url: '/logout',
    controller: 'LogoutCtrl'
  });
  return $urlRouterProvider.otherwise('/capture');
}).run([
  '$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
    return Auth.monitor();
  }
]);
