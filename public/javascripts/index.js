window.myapp_constants = {
  some_url: 'http://www.example.com'
};

angular.module('gryfter.controllers', []);

var DATA, chart, first_stamp, randomBox;

angular.module('gryfter.controllers').controller('ChartCtrl', function($scope, $http, UserSession, socket) {
  chart.series[0].data = DATA;
  chart.updater = function() {
    var series;
    series = this.series[0];
    return socket.on('update_graph', function() {
      return series.addPoint(randomBox(), true, true);
    });
  };
  $scope.chartData = chart;
  return socket.on('connect', function() {}).on('disconnect', function() {
    return console.log('disconnected');
  });
});

randomBox = function(t) {
  var close, high, low, open;
  t = t || new Date().getTime();
  open = Math.random() * 5 + 370;
  high = Math.random() * 8 + 368;
  low = Math.random() * 8 + 368;
  close = Math.random() * 5 + 370;
  return [t, open, high, low, close];
};

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

first_stamp = 1317888000000;

DATA = [[1317888000000, 372.5101, 375, 372.2, 372.52]];

_(100).times(function(i) {
  return DATA.push(randomBox(first_stamp + 1000 * i));
});

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
}).service('socket', function(UserSession) {
  return io.connect(window.location.origin, {
    query: 'token=' + UserSession.loggedIn()
  });
}).service('UserSession', function(Session, $cookieStore, $window) {
  var current, session;
  current = $window.sessionStorage.token;
  return session = {
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
        var chart, newSettings, updater;
        if (!value) {
          return;
        }
        updater = $scope.chartData.updater;
        delete $scope.chartData.updater;
        newSettings = {};
        angular.extend(newSettings, chartsDefaults, $scope.chartData);
        if (updater) {
          newSettings.chart.events = {
            load: updater
          };
        }
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
