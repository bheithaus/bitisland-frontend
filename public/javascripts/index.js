window.myapp_constants = {
  some_url: 'http://www.example.com'
};

angular.module('BI.controllers', []);

angular.module('BI.controllers').controller('AccountCtrl', function($scope, $http, UserSession, socket, selectedCurrency) {
  $scope.displayCurrency = selectedCurrency.value;
  selectedCurrency.change(function() {
    return $scope.displayCurrency = selectedCurrency.value;
  });
  $scope.exchanges = [
    {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1200,
      visible: 20000,
      tif: 30320
    }, {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1200,
      visible: 20000,
      tif: 30320
    }, {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1200,
      visible: 20000,
      tif: 30320
    }, {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1134,
      visible: 20000,
      tif: 30320
    }
  ];
  return socket.on('update_account_orders', function(data) {
    console.log('heres the account book', data);
    if (data) {
      return $scope.$apply(function() {
        return $scope.exchanges = data.orders;
      });
    }
  });
});

var DATA, chart, first_stamp, randomBox;

angular.module('BI.controllers').controller('ChartCtrl', function($scope, $http, UserSession, socket) {
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
  open = Math.random() * 2 + 368;
  high = Math.random() * 3 + 368;
  low = Math.random() * 3 + 368;
  close = Math.random() * 2 + 368;
  return [t, open, high, low, close];
};

chart = {
  title: {
    text: 'Live BTI Market Data'
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
  plotOptions: {
    candlestick: {
      lineColor: 'red',
      upLineColor: 'green',
      upColor: 'green'
    }
  },
  series: [
    {
      name: 'BCI',
      type: 'candlestick',
      data: '',
      tooltip: {
        valueDecimals: 2
      }
    }
  ]
};

first_stamp = 1317888000000;

DATA = [];

_(50).times(function(i) {
  return DATA.push(randomBox(first_stamp + 1000 * i));
});

angular.module('BI.controllers').controller('ExchangeCtrl', function($scope, $http, UserSession, socket, selectedCurrency) {
  $scope.displayCurrency = selectedCurrency.get;
  selectedCurrency.change(function() {
    return $scope.displayCurrency = selectedCurrency.value;
  });
  $scope.exchanges = [
    {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1200,
      visible: 20000,
      tif: 30320
    }, {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1200,
      visible: 20000,
      tif: 30320
    }, {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1200,
      visible: 20000,
      tif: 30320
    }, {
      timestamp: 'thurs 2014',
      position: 'buy',
      price: 1134,
      visible: 20000,
      tif: 30320
    }
  ];
  return socket.on('update_order_book', function(data) {
    console.log('heres the order book', data);
    if (data) {
      return $scope.$apply(function() {
        return $scope.exchanges = data.orders;
      });
    }
  });
}).controller('CurrencySwitch', function($scope, selectedCurrency, currencyChoices) {
  $scope.display = selectedCurrency.value;
  currencyChoices.changed(function(choices) {
    return $scope.currencies = choices;
  });
  return $scope.$watch('selected', function(selected, oldSelected) {
    console.log('selected', selected, oldSelected);
    if (selected && (selected.code || currencyChoices.obj[selected.toUpperCase()])) {
      console.log('passed test', selected);
      if (selected.code) {
        selectedCurrency.set(selected);
      } else {
        selectedCurrency.set(currencyChoices.obj[selected.toUpperCase()]);
      }
      return $scope.display = selectedCurrency.value;
    }
  });
});

angular.module('BI.controllers').controller('HomeCtrl', function($scope, $http, $location, LoginModal, User) {
  return $scope.name = 'hey derr';
});

angular.module('BI.controllers').controller('ListCtrl', function($scope, $http, $location, LoginModal, User) {
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

angular.module('BI.controllers').controller('LoginInstanceCtrl', function($scope, $modalInstance, Auth, $state) {
  $scope.user = {};
  $scope.login = function() {
    return Auth.login('password', {
      name: $scope.user.name,
      password: $scope.user.password
    }, function(error) {
      if (!error) {
        $modalInstance.dismiss();
        return $state.transitionTo('trade');
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

angular.module('BI.controllers').controller('LogoutCtrl', function($scope, $http, Auth, $state) {
  return Auth.logout(function() {
    return $state.transitionTo('home');
  });
});

angular.module('BI.controllers').controller('OrderCtrl', function($scope, Order, currentOrder, selectedCurrency) {
  var setOrder;
  $scope.activeOrderType = 'market';
  $scope.displayCurrency = selectedCurrency.value;
  selectedCurrency.change(function() {
    return $scope.displayCurrency = selectedCurrency.value;
  });
  setOrder = function() {
    return currentOrder.set({
      type: $scope.activeOrderType,
      price: $scope.price,
      quantity: $scope.quantity
    });
  };
  $scope.$watch('price', setOrder);
  $scope.$watch('type', setOrder);
  $scope.$watch('quantity', setOrder);
  $scope.focus = function(type) {
    return $scope.activeOrderType = type;
  };
  return $scope.activeOrder = function(type) {
    if ($scope.activeOrderType !== type) {
      return 'disabled';
    } else {
      return '';
    }
  };
}).controller('PurchaseCtrl', function($scope, $http, Order, currentOrder) {
  $scope.cancel = function() {
    return $http["delete"]('/api/orders').success(function(data) {
      return console.log('data', data);
    }).error(function(data) {
      return console.error('data', data);
    });
  };
  return $scope.order = function(type) {
    var order;
    order = angular.extend(currentOrder.get(), {
      position: type
    });
    console.log('order', order);
    if (!order.quantity) {
      return;
    }
    if (order.type === 'limit' && !order.price) {
      return;
    }
    return Order.save(order, function(data) {
      if (!data.error) {
        console.log('successful order');
      }
      return console.log('execute market order');
    });
  };
});

angular.module('BI.controllers').controller('RegisterInstanceCtrl', function($scope, $modalInstance, $state, Auth) {
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

angular.module('BI.controllers').controller('AppCtrl', function($scope, $location, LoginModal, RegisterModal, UserSession, Auth, $state) {
  $scope.logout = function() {
    return Auth.logout(function() {
      return $state.transitionTo('home');
    });
  };
  $scope.login = LoginModal.open;
  $scope.register = RegisterModal.open;
  $scope.errors = $location.search().incorrect;
  $scope.loggedIn = function() {
    return UserSession.loggedIn();
  };
  return $scope.user = UserSession;
});

angular.module('BI.controllers').controller('TradeCtrl', function($scope, $http, $location, LoginModal, User) {
  return $scope.name = 'hey derr';
});

angular.module('BI.services', []);

angular.module('BI.services').factory('LoginModal', function($modal, $log) {
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

var CURRENCY_NAMES;

angular.module('BI.services').factory('Session', function($resource) {
  return $resource('/authentication');
}).factory('User', function($resource) {
  return $resource('/register');
}).factory('Order', function($resource) {
  return $resource('/api/orders');
}).service('socket', function(UserSession) {
  return io.connect(window.location.origin, {
    query: 'token=' + UserSession.loggedIn()
  });
}).service('UserSession', function($window) {
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
}).factory('authInterceptor', function($rootScope, $q, $window, $location, UserSession) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if (UserSession.loggedIn() && config.url.match(/^\/api/)) {
        config.headers.Authorization = 'Bearer ' + UserSession.loggedIn();
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401) {
        UserSession.logout();
        $location.path('/');
      }
      return response || $q.when(response);
    }
  };
}).factory('currentOrder', function() {
  var currentOrder, getSet;
  currentOrder = {};
  return getSet = {
    get: function() {
      return currentOrder;
    },
    set: function(order) {
      console.log('set to ', order);
      return currentOrder = order;
    }
  };
}).service('selectedCurrency', function() {
  var selectedCurrency;
  return selectedCurrency = {
    listeners: [],
    value: {
      rate: 1,
      code: 'USD',
      name: 'United States Dollars'
    },
    set: function(selection) {
      console.log('set to', selection);
      selectedCurrency.value = selection;
      return this.notify();
    },
    get: function() {
      return this.value;
    },
    change: function(cb) {
      if (typeof cb === 'function') {
        return this.listeners.push(cb);
      }
    },
    notify: function() {
      var listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(listener(this.value));
      }
      return _results;
    }
  };
}).factory('currencyChoices', function($http, selectedCurrency) {
  var Currency_url, USD, completedCurrencyChoices, currencyChoices, xRates;
  Currency_url = "http://openexchangerates.org/api/latest.json?app_id=7b929627965a44329df5a6c0b8898a8e";
  completedCurrencyChoices = {
    obj: {},
    array: []
  };
  USD = null;
  xRates = $http.get(Currency_url).success(function(data) {
    var code, currency, xRate, _ref;
    _ref = data.rates;
    for (code in _ref) {
      xRate = _ref[code];
      currency = {};
      currency.rate = xRate;
      if (CURRENCY_NAMES[code]) {
        currency.name = CURRENCY_NAMES[code].currency;
        currency.code = code;
        completedCurrencyChoices.array.push(currency);
        completedCurrencyChoices.obj[code] = currency;
        if (code === 'USD') {
          USD = currency;
        }
      }
    }
    currencyChoices.array = completedCurrencyChoices.array;
    currencyChoices.obj = completedCurrencyChoices.obj;
    currencyChoices.notify();
    return selectedCurrency.set(USD);
  }).error(function(data) {
    return console.log('data', data);
  });
  return currencyChoices = {
    changed: function(cb) {
      return this.cb = cb;
    },
    notify: function() {
      return this.cb(currencyChoices.array);
    }
  };
});

CURRENCY_NAMES = {
  'AED': {
    currency: "United Arab Emirates Dirham"
  },
  'AFN': {
    currency: "Afghanistan Afghani"
  },
  'ALL': {
    currency: "Albania Lek"
  },
  'AMD': {
    currency: "Armenia Dram"
  },
  'ANG': {
    currency: "Netherlands Antilles Guilder"
  },
  'AOA': {
    currency: "Angola Kwanza"
  },
  'ARS': {
    currency: "Argentina Peso"
  },
  'AUD': {
    currency: "Australia Dollar"
  },
  'AWG': {
    currency: "Aruba Guilder"
  },
  'AZN': {
    currency: "Azerbaijan New Manat"
  },
  'BAM': {
    currency: "Bosnia and Herzegovina Convertible Marka"
  },
  'BBD': {
    currency: "Barbados Dollar"
  },
  'BDT': {
    currency: "Bangladesh Taka"
  },
  'BGN': {
    currency: "Bulgaria Lev"
  },
  'BHD': {
    currency: "Bahrain Dinar"
  },
  'BIF': {
    currency: "Burundi Franc"
  },
  'BMD': {
    currency: "Bermuda Dollar"
  },
  'BND': {
    currency: "Brunei Darussalam Dollar"
  },
  'BOB': {
    currency: "Bolivia Boliviano"
  },
  'BRL': {
    currency: "Brazil Real"
  },
  'BSD': {
    currency: "Bahamas Dollar"
  },
  'BTN': {
    currency: "Bhutan Ngultrum"
  },
  'BWP': {
    currency: "Botswana Pula"
  },
  'BYR': {
    currency: "Belarus Ruble"
  },
  'BZD': {
    currency: "Belize Dollar"
  },
  'CAD': {
    currency: "Canada Dollar"
  },
  'CDF': {
    currency: "Congo/Kinshasa Franc"
  },
  'CHF': {
    currency: "Switzerland Franc"
  },
  'CLP': {
    currency: "Chile Peso"
  },
  'CNY': {
    currency: "China Yuan Renminbi"
  },
  'COP': {
    currency: "Colombia Peso"
  },
  'CRC': {
    currency: "Costa Rica Colon"
  },
  'CUC': {
    currency: "Cuba Convertible Peso"
  },
  'CUP': {
    currency: "Cuba Peso"
  },
  'CVE': {
    currency: "Cape Verde Escudo"
  },
  'CZK': {
    currency: "Czech Republic Koruna"
  },
  'DJF': {
    currency: "Djibouti Franc"
  },
  'DKK': {
    currency: "Denmark Krone"
  },
  'DOP': {
    currency: "Dominican Republic Peso"
  },
  'DZD': {
    currency: "Algeria Dinar"
  },
  'EGP': {
    currency: "Egypt Pound"
  },
  'ERN': {
    currency: "Eritrea Nakfa"
  },
  'ETB': {
    currency: "Ethiopia Birr"
  },
  'EUR': {
    currency: "Euro Member Countries"
  },
  'FJD': {
    currency: "Fiji Dollar"
  },
  'FKP': {
    currency: "Falkland Islands (Malvinas) Pound"
  },
  'GBP': {
    currency: "United Kingdom Pound"
  },
  'GEL': {
    currency: "Georgia Lari"
  },
  'GGP': {
    currency: "Guernsey Pound"
  },
  'GHS': {
    currency: "Ghana Cedi"
  },
  'GIP': {
    currency: "Gibraltar Pound"
  },
  'GMD': {
    currency: "Gambia Dalasi"
  },
  'GNF': {
    currency: "Guinea Franc"
  },
  'GTQ': {
    currency: "Guatemala Quetzal"
  },
  'GYD': {
    currency: "Guyana Dollar"
  },
  'HKD': {
    currency: "Hong Kong Dollar"
  },
  'HNL': {
    currency: "Honduras Lempira"
  },
  'HRK': {
    currency: "Croatia Kuna"
  },
  'HTG': {
    currency: "Haiti Gourde"
  },
  'HUF': {
    currency: "Hungary Forint"
  },
  'IDR': {
    currency: "Indonesia Rupiah"
  },
  'ILS': {
    currency: "Israel Shekel"
  },
  'IMP': {
    currency: "Isle of Man Pound"
  },
  'INR': {
    currency: "India Rupee"
  },
  'IQD': {
    currency: "Iraq Dinar"
  },
  'IRR': {
    currency: "Iran Rial"
  },
  'ISK': {
    currency: "Iceland Krona"
  },
  'JEP': {
    currency: "Jersey Pound"
  },
  'JMD': {
    currency: "Jamaica Dollar"
  },
  'JOD': {
    currency: "Jordan Dinar"
  },
  'JPY': {
    currency: "Japan Yen"
  },
  'KES': {
    currency: "Kenya Shilling"
  },
  'KGS': {
    currency: "Kyrgyzstan Som"
  },
  'KHR': {
    currency: "Cambodia Riel"
  },
  'KMF': {
    currency: "Comoros Franc"
  },
  'KPW': {
    currency: "Korea (North) Won"
  },
  'KRW': {
    currency: "Korea (South) Won"
  },
  'KWD': {
    currency: "Kuwait Dinar"
  },
  'KYD': {
    currency: "Cayman Islands Dollar"
  },
  'KZT': {
    currency: "Kazakhstan Tenge"
  },
  'LAK': {
    currency: "Laos Kip"
  },
  'LBP': {
    currency: "Lebanon Pound"
  },
  'LKR': {
    currency: "Sri Lanka Rupee"
  },
  'LRD': {
    currency: "Liberia Dollar"
  },
  'LSL': {
    currency: "Lesotho Loti"
  },
  'LTL': {
    currency: "Lithuania Litas"
  },
  'LVL': {
    currency: "Latvia Lat"
  },
  'LYD': {
    currency: "Libya Dinar"
  },
  'MAD': {
    currency: "Morocco Dirham"
  },
  'MDL': {
    currency: "Moldova Leu"
  },
  'MGA': {
    currency: "Madagascar Ariary"
  },
  'MKD': {
    currency: "Macedonia Denar"
  },
  'MMK': {
    currency: "Myanmar (Burma) Kyat"
  },
  'MNT': {
    currency: "Mongolia Tughrik"
  },
  'MOP': {
    currency: "Macau Pataca"
  },
  'MRO': {
    currency: "Mauritania Ouguiya"
  },
  'MUR': {
    currency: "Mauritius Rupee"
  },
  'MVR': {
    currency: "Maldives (Maldive Islands) Rufiyaa"
  },
  'MWK': {
    currency: "Malawi Kwacha"
  },
  'MXN': {
    currency: "Mexico Peso"
  },
  'MYR': {
    currency: "Malaysia Ringgit"
  },
  'MZN': {
    currency: "Mozambique Metical"
  },
  'NAD': {
    currency: "Namibia Dollar"
  },
  'NGN': {
    currency: "Nigeria Naira"
  },
  'NIO': {
    currency: "Nicaragua Cordoba"
  },
  'NOK': {
    currency: "Norway Krone"
  },
  'NPR': {
    currency: "Nepal Rupee"
  },
  'NZD': {
    currency: "New Zealand Dollar"
  },
  'OMR': {
    currency: "Oman Rial"
  },
  'PAB': {
    currency: "Panama Balboa"
  },
  'PEN': {
    currency: "Peru Nuevo Sol"
  },
  'PGK': {
    currency: "Papua New Guinea Kina"
  },
  'PHP': {
    currency: "Philippines Peso"
  },
  'PKR': {
    currency: "Pakistan Rupee"
  },
  'PLN': {
    currency: "Poland Zloty"
  },
  'PYG': {
    currency: "Paraguay Guarani"
  },
  'QAR': {
    currency: "Qatar Riyal"
  },
  'RON': {
    currency: "Romania New Leu"
  },
  'RSD': {
    currency: "Serbia Dinar"
  },
  'RUB': {
    currency: "Russia Ruble"
  },
  'RWF': {
    currency: "Rwanda Franc"
  },
  'SAR': {
    currency: "Saudi Arabia Riyal"
  },
  'SBD': {
    currency: "Solomon Islands Dollar"
  },
  'SCR': {
    currency: "Seychelles Rupee"
  },
  'SDG': {
    currency: "Sudan Pound"
  },
  'SEK': {
    currency: "Sweden Krona"
  },
  'SGD': {
    currency: "Singapore Dollar"
  },
  'SHP': {
    currency: "Saint Helena Pound"
  },
  'SLL': {
    currency: "Sierra Leone Leone"
  },
  'SOS': {
    currency: "Somalia Shilling"
  },
  'SRD': {
    currency: "Suriname Dollar"
  },
  'STD': {
    currency: "São Tomé and Príncipe Dobra"
  },
  'SVC': {
    currency: "El Salvador Colon"
  },
  'SYP': {
    currency: "Syria Pound"
  },
  'SZL': {
    currency: "Swaziland Lilangeni"
  },
  'THB': {
    currency: "Thailand Baht"
  },
  'TJS': {
    currency: "Tajikistan Somoni"
  },
  'TMT': {
    currency: "Turkmenistan Manat"
  },
  'TND': {
    currency: "Tunisia Dinar"
  },
  'TOP': {
    currency: "Tonga Pa'anga"
  },
  'TRY': {
    currency: "Turkey Lira"
  },
  'TTD': {
    currency: "Trinidad and Tobago Dollar"
  },
  'TVD': {
    currency: "Tuvalu Dollar"
  },
  'TWD': {
    currency: "Taiwan New Dollar"
  },
  'TZS': {
    currency: "Tanzania Shilling"
  },
  'UAH': {
    currency: "Ukraine Hryvna"
  },
  'UGX': {
    currency: "Uganda Shilling"
  },
  'USD': {
    currency: "United States Dollar"
  },
  'UYU': {
    currency: "Uruguay Peso"
  },
  'UZS': {
    currency: "Uzbekistan Som"
  },
  'VEF': {
    currency: "Venezuela Bolivar"
  },
  'VND': {
    currency: "Viet Nam Dong"
  },
  'VUV': {
    currency: "Vanuatu Vatu"
  },
  'WST': {
    currency: "Samoa Tala"
  },
  'XAF': {
    currency: "Communauté Financière Africaine (BEAC) CFA Franc BEAC"
  },
  'XCD': {
    currency: "East Caribbean Dollar"
  },
  'XDR': {
    currency: "International Monetary Fund (IMF) Special Drawing Rights"
  },
  'XOF': {
    currency: "Communauté Financière Africaine (BCEAO) Franc"
  },
  'XPF': {
    currency: "Comptoirs Français du Pacifique (CFP) Franc"
  },
  'YER': {
    currency: "Yemen Rial"
  },
  'ZAR': {
    currency: "South Africa Rand"
  },
  'ZMW': {
    currency: "Zambia Kwacha"
  },
  'ZWD': {
    currency: "Zimbabwe Dollar"
  }
};

'use strict';
angular.module('BI.directives', []).directive('gryft', function() {
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
}).directive('positiveNumber', function() {
  return {
    link: function($scope, elm, attrs, ctrl) {
      return $scope.$watch(attrs.ngModel, function(newVal) {
        if (newVal < 0) {
          return $scope[attrs.ngModel] = 0;
        }
      });
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
          width: attrs.width || null,
          backgroundColor: 'black'
        },
        colors: ['#DE2323', '#32DB14', '#FFFF38', '#FFFFFF', '#DE2323', '#32DB14', '#FFFF38', '#FFFFFF']
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

angular.module('BI.filters', []).filter('exchangeRate', function(selectedCurrency) {
  return function(price) {
    return Number(price * selectedCurrency.value.rate).toFixed(3);
  };
});

var BI;

BI = angular.module('BI', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'ngCookies', 'ngResource', 'BI.controllers', 'BI.directives', 'BI.services', 'BI.filters']).config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
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
