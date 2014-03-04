window.myapp_constants = {
  some_url: 'http://www.example.com'
};

angular.module('BI.controllers', []);

angular.module('BI.controllers').controller('AccountCtrl', function($scope, $http, UserSession, socket, selectedCurrency, LatestTrade) {
  $scope.displayCurrency = selectedCurrency.value;
  selectedCurrency.change(function() {
    return $scope.displayCurrency = selectedCurrency.value;
  });
  $scope.up = function(price) {
    return price >= $scope.latestPrice;
  };
  $scope.exchanges = [
    {
      timestamp: 'LOADING....'
    }
  ];
  return socket.on('update_completed_book', function(data) {
    if (data && data.orders) {
      return $scope.$apply(function() {
        var i;
        $scope.latestPrice = 0;
        i = 0;
        while (!($scope.latestPrice || i === data.orders.length)) {
          $scope.latestPrice = data.orders[i].price;
          i++;
        }
        LatestTrade.set($scope.latestPrice);
        return $scope.exchanges = data.orders.slice(0, 5);
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
    return socket.on('update_graph', function(data) {
      console.log('graph data', data);
      if (data && data.length === 5) {
        return series.addPoint(data, true, true);
      }
    });
  };
  return $scope.chartData = chart;
});

randomBox = function(t) {
  var close, high, low, open;
  t = t || new Date().getTime();
  open = Math.random() * 20 + 570;
  high = Math.random() * 30 + 570;
  low = Math.random() * 30 + 570;
  close = Math.random() * 20 + 570;
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
      upColor: 'rgba(0,200,0,0.6)'
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
      timestamp: 'No Orders on the books',
      price: 0
    }
  ];
  return socket.on('update_pending_book', function(data) {
    if (data && data.orders) {
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
    if (selected && (selected.code || currencyChoices.obj[selected.toUpperCase()])) {
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
  var prop, setOrder, _i, _len, _ref;
  $scope.orderType = 'market';
  $scope.orderTypes = ['market', 'limit', 'sell_short', 'stop', 'iceberg', 'hidden'];
  $scope.tif = 'day';
  $scope.tifTypes = ['day', 'gtc', 'fok', 'tif'];
  $scope.market = 'bti';
  $scope.marketTypes = ['bti', 'mtgox', 'bitstamp', 'btce'];
  $scope.displayCurrency = selectedCurrency.value;
  selectedCurrency.change(function() {
    return $scope.displayCurrency = selectedCurrency.value;
  });
  setOrder = function() {
    return currentOrder.set({
      type: $scope.orderType,
      price: $scope.price,
      quantity: $scope.quantity,
      visible: $scope.visible,
      tif: $scope.tif,
      market: $scope.market
    });
  };
  _ref = ['price', 'orderType', 'quantity', 'tif', 'market', 'visible'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    prop = _ref[_i];
    $scope.$watch(prop, setOrder);
  }
  $scope.$watch('quantity', function(val) {
    if (!$scope.visibleEdited) {
      return $scope.visible = val;
    }
  });
  $scope.editVisible = function() {
    return $scope.visibleEdited = true;
  };
  $scope.selected = function(type) {
    return $scope.orderType = type;
  };
  return $scope.active = function(type) {
    if ($scope.orderType === type) {
      return true;
    } else {
      return false;
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
  $scope.user = UserSession;
  $scope.color = 'dark';
  return $scope.toggleColor = function() {
    $scope.color = $scope.color === 'dark' ? 'light' : 'dark';
    return console.log('color', $scope.color);
  };
});

angular.module('BI.controllers').controller('TickerCtrl', function($scope, $http, UserSession, socket, selectedCurrency, LatestTrade) {
  $scope.displayCurrency = selectedCurrency.value;
  selectedCurrency.change(function() {
    return $scope.displayCurrency = selectedCurrency.value;
  });
  $scope.up = function(price) {
    return price >= $scope.latestPrice;
  };
  $scope.ticker = {
    ask: 0,
    bid: 0,
    last_trade: 0
  };
  $scope.$watch(LatestTrade.get, function(val) {
    if (val) {
      return $scope.latestPrice = val;
    }
  });
  socket.on('update_ticker', function(data) {
    if (data) {
      return $scope.$apply(function() {
        var key, val, _results;
        _results = [];
        for (key in data) {
          val = data[key];
          if (val && typeof val.price === 'number') {
            _results.push($scope.ticker[key] = val.price);
          } else if (typeof val === 'number') {
            _results.push($scope.ticker[key] = val);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }
  });
  return socket.on('update_completed_book', function(data) {
    if (data && data.orders) {
      return $scope.$apply(function() {
        return $scope.orders = data.orders;
      });
    }
  });
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
}).service('LatestTrade', function() {
  var latest;
  latest = {};
  return {
    set: function(data) {
      return latest = data;
    },
    get: function() {
      return latest;
    }
  };
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
        currency.sym = CURRENCY_NAMES[code].symbol;
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
  AED: {
    currency: 'United Arab Emirates Dirham',
    symbol: 'AED'
  },
  AFN: {
    currency: 'Afghanistan Afghani',
    symbol: 'Af'
  },
  ALL: {
    currency: 'Albania Lek',
    symbol: 'ALL'
  },
  AMD: {
    currency: 'Armenia Dram',
    symbol: 'AMD'
  },
  ANG: {
    currency: 'Netherlands Antilles Guilder'
  },
  AOA: {
    currency: 'Angola Kwanza'
  },
  ARS: {
    currency: 'Argentina Peso',
    symbol: 'AR$'
  },
  AUD: {
    currency: 'Australia Dollar',
    symbol: 'AU$'
  },
  AWG: {
    currency: 'Aruba Guilder'
  },
  AZN: {
    currency: 'Azerbaijan New Manat',
    symbol: 'man.'
  },
  BAM: {
    currency: 'Bosnia and Herzegovina Convertible Marka',
    symbol: 'KM'
  },
  BBD: {
    currency: 'Barbados Dollar'
  },
  BDT: {
    currency: 'Bangladesh Taka',
    symbol: 'Tk'
  },
  BGN: {
    currency: 'Bulgaria Lev',
    symbol: 'BGN'
  },
  BHD: {
    currency: 'Bahrain Dinar',
    symbol: 'BD'
  },
  BIF: {
    currency: 'Burundi Franc',
    symbol: 'FBu'
  },
  BMD: {
    currency: 'Bermuda Dollar'
  },
  BND: {
    currency: 'Brunei Darussalam Dollar',
    symbol: 'BN$'
  },
  BOB: {
    currency: 'Bolivia Boliviano',
    symbol: 'Bs'
  },
  BRL: {
    currency: 'Brazil Real',
    symbol: 'R$'
  },
  BSD: {
    currency: 'Bahamas Dollar'
  },
  BTN: {
    currency: 'Bhutan Ngultrum'
  },
  BWP: {
    currency: 'Botswana Pula',
    symbol: 'BWP'
  },
  BYR: {
    currency: 'Belarus Ruble',
    symbol: 'BYR'
  },
  BZD: {
    currency: 'Belize Dollar',
    symbol: 'BZ$'
  },
  CAD: {
    currency: 'Canada Dollar',
    symbol: 'CA$'
  },
  CDF: {
    currency: 'Congo/Kinshasa Franc',
    symbol: 'CDF'
  },
  CHF: {
    currency: 'Switzerland Franc',
    symbol: 'CHF'
  },
  CLP: {
    currency: 'Chile Peso',
    symbol: 'CL$'
  },
  CNY: {
    currency: 'China Yuan Renminbi',
    symbol: 'CN¥'
  },
  COP: {
    currency: 'Colombia Peso',
    symbol: 'CO$'
  },
  CRC: {
    currency: 'Costa Rica Colon',
    symbol: '₡'
  },
  CUC: {
    currency: 'Cuba Convertible Peso'
  },
  CUP: {
    currency: 'Cuba Peso'
  },
  CVE: {
    currency: 'Cape Verde Escudo',
    symbol: 'CV$'
  },
  CZK: {
    currency: 'Czech Republic Koruna',
    symbol: 'Kč'
  },
  DJF: {
    currency: 'Djibouti Franc',
    symbol: 'Fdj'
  },
  DKK: {
    currency: 'Denmark Krone',
    symbol: 'Dkr'
  },
  DOP: {
    currency: 'Dominican Republic Peso',
    symbol: 'RD$'
  },
  DZD: {
    currency: 'Algeria Dinar',
    symbol: 'DA'
  },
  EGP: {
    currency: 'Egypt Pound',
    symbol: 'EGP'
  },
  ERN: {
    currency: 'Eritrea Nakfa',
    symbol: 'Nfk'
  },
  ETB: {
    currency: 'Ethiopia Birr',
    symbol: 'Br'
  },
  EUR: {
    currency: 'Euro Member Countries',
    symbol: '€'
  },
  FJD: {
    currency: 'Fiji Dollar'
  },
  FKP: {
    currency: 'Falkland Islands (Malvinas) Pound'
  },
  GBP: {
    currency: 'United Kingdom Pound',
    symbol: '£'
  },
  GEL: {
    currency: 'Georgia Lari',
    symbol: 'GEL'
  },
  GGP: {
    currency: 'Guernsey Pound'
  },
  GHS: {
    currency: 'Ghana Cedi',
    symbol: 'GH₵'
  },
  GIP: {
    currency: 'Gibraltar Pound'
  },
  GMD: {
    currency: 'Gambia Dalasi'
  },
  GNF: {
    currency: 'Guinea Franc',
    symbol: 'FG'
  },
  GTQ: {
    currency: 'Guatemala Quetzal',
    symbol: 'GTQ'
  },
  GYD: {
    currency: 'Guyana Dollar'
  },
  HKD: {
    currency: 'Hong Kong Dollar',
    symbol: 'HK$'
  },
  HNL: {
    currency: 'Honduras Lempira',
    symbol: 'HNL'
  },
  HRK: {
    currency: 'Croatia Kuna',
    symbol: 'kn'
  },
  HTG: {
    currency: 'Haiti Gourde'
  },
  HUF: {
    currency: 'Hungary Forint',
    symbol: 'Ft'
  },
  IDR: {
    currency: 'Indonesia Rupiah',
    symbol: 'Rp'
  },
  ILS: {
    currency: 'Israel Shekel',
    symbol: '₪'
  },
  IMP: {
    currency: 'Isle of Man Pound'
  },
  INR: {
    currency: 'India Rupee',
    symbol: 'Rs'
  },
  IQD: {
    currency: 'Iraq Dinar',
    symbol: 'IQD'
  },
  IRR: {
    currency: 'Iran Rial',
    symbol: 'IRR'
  },
  ISK: {
    currency: 'Iceland Krona',
    symbol: 'Ikr'
  },
  JEP: {
    currency: 'Jersey Pound'
  },
  JMD: {
    currency: 'Jamaica Dollar',
    symbol: 'J$'
  },
  JOD: {
    currency: 'Jordan Dinar',
    symbol: 'JD'
  },
  JPY: {
    currency: 'Japan Yen',
    symbol: '¥'
  },
  KES: {
    currency: 'Kenya Shilling',
    symbol: 'Ksh'
  },
  KGS: {
    currency: 'Kyrgyzstan Som'
  },
  KHR: {
    currency: 'Cambodia Riel',
    symbol: 'KHR'
  },
  KMF: {
    currency: 'Comoros Franc',
    symbol: 'CF'
  },
  KPW: {
    currency: 'Korea (North) Won'
  },
  KRW: {
    currency: 'Korea (South) Won',
    symbol: '₩'
  },
  KWD: {
    currency: 'Kuwait Dinar',
    symbol: 'KD'
  },
  KYD: {
    currency: 'Cayman Islands Dollar'
  },
  KZT: {
    currency: 'Kazakhstan Tenge',
    symbol: 'KZT'
  },
  LAK: {
    currency: 'Laos Kip'
  },
  LBP: {
    currency: 'Lebanon Pound',
    symbol: 'LB£'
  },
  LKR: {
    currency: 'Sri Lanka Rupee',
    symbol: 'SLRs'
  },
  LRD: {
    currency: 'Liberia Dollar'
  },
  LSL: {
    currency: 'Lesotho Loti'
  },
  LTL: {
    currency: 'Lithuania Litas',
    symbol: 'Lt'
  },
  LVL: {
    currency: 'Latvia Lat',
    symbol: 'Ls'
  },
  LYD: {
    currency: 'Libya Dinar',
    symbol: 'LD'
  },
  MAD: {
    currency: 'Morocco Dirham',
    symbol: 'MAD'
  },
  MDL: {
    currency: 'Moldova Leu',
    symbol: 'MDL'
  },
  MGA: {
    currency: 'Madagascar Ariary',
    symbol: 'MGA'
  },
  MKD: {
    currency: 'Macedonia Denar',
    symbol: 'MKD'
  },
  MMK: {
    currency: 'Myanmar (Burma) Kyat',
    symbol: 'MMK'
  },
  MNT: {
    currency: 'Mongolia Tughrik'
  },
  MOP: {
    currency: 'Macau Pataca',
    symbol: 'MOP$'
  },
  MRO: {
    currency: 'Mauritania Ouguiya'
  },
  MUR: {
    currency: 'Mauritius Rupee',
    symbol: 'MURs'
  },
  MVR: {
    currency: 'Maldives (Maldive Islands) Rufiyaa'
  },
  MWK: {
    currency: 'Malawi Kwacha'
  },
  MXN: {
    currency: 'Mexico Peso',
    symbol: 'MX$'
  },
  MYR: {
    currency: 'Malaysia Ringgit',
    symbol: 'RM'
  },
  MZN: {
    currency: 'Mozambique Metical',
    symbol: 'MTn'
  },
  NAD: {
    currency: 'Namibia Dollar',
    symbol: 'N$'
  },
  NGN: {
    currency: 'Nigeria Naira',
    symbol: '₦'
  },
  NIO: {
    currency: 'Nicaragua Cordoba',
    symbol: 'C$'
  },
  NOK: {
    currency: 'Norway Krone',
    symbol: 'Nkr'
  },
  NPR: {
    currency: 'Nepal Rupee',
    symbol: 'NPRs'
  },
  NZD: {
    currency: 'New Zealand Dollar',
    symbol: 'NZ$'
  },
  OMR: {
    currency: 'Oman Rial',
    symbol: 'OMR'
  },
  PAB: {
    currency: 'Panama Balboa',
    symbol: 'B/.'
  },
  PEN: {
    currency: 'Peru Nuevo Sol',
    symbol: 'S/.'
  },
  PGK: {
    currency: 'Papua New Guinea Kina'
  },
  PHP: {
    currency: 'Philippines Peso',
    symbol: '₱'
  },
  PKR: {
    currency: 'Pakistan Rupee',
    symbol: 'PKRs'
  },
  PLN: {
    currency: 'Poland Zloty',
    symbol: 'zł'
  },
  PYG: {
    currency: 'Paraguay Guarani',
    symbol: '₲'
  },
  QAR: {
    currency: 'Qatar Riyal',
    symbol: 'QR'
  },
  RON: {
    currency: 'Romania New Leu',
    symbol: 'RON'
  },
  RSD: {
    currency: 'Serbia Dinar',
    symbol: 'din.'
  },
  RUB: {
    currency: 'Russia Ruble',
    symbol: 'RUB'
  },
  RWF: {
    currency: 'Rwanda Franc',
    symbol: 'RWF'
  },
  SAR: {
    currency: 'Saudi Arabia Riyal',
    symbol: 'SR'
  },
  SBD: {
    currency: 'Solomon Islands Dollar'
  },
  SCR: {
    currency: 'Seychelles Rupee'
  },
  SDG: {
    currency: 'Sudan Pound',
    symbol: 'SDG'
  },
  SEK: {
    currency: 'Sweden Krona',
    symbol: 'Skr'
  },
  SGD: {
    currency: 'Singapore Dollar',
    symbol: 'S$'
  },
  SHP: {
    currency: 'Saint Helena Pound'
  },
  SLL: {
    currency: 'Sierra Leone Leone'
  },
  SOS: {
    currency: 'Somalia Shilling',
    symbol: 'Ssh'
  },
  SRD: {
    currency: 'Suriname Dollar'
  },
  STD: {
    currency: 'São Tomé and Príncipe Dobra'
  },
  SVC: {
    currency: 'El Salvador Colon'
  },
  SYP: {
    currency: 'Syria Pound',
    symbol: 'SY£'
  },
  SZL: {
    currency: 'Swaziland Lilangeni'
  },
  THB: {
    currency: 'Thailand Baht',
    symbol: '฿'
  },
  TJS: {
    currency: 'Tajikistan Somoni'
  },
  TMT: {
    currency: 'Turkmenistan Manat'
  },
  TND: {
    currency: 'Tunisia Dinar',
    symbol: 'DT'
  },
  TOP: {
    currency: 'Tonga Pa\'anga',
    symbol: 'T$'
  },
  TRY: {
    currency: 'Turkey Lira',
    symbol: 'TL'
  },
  TTD: {
    currency: 'Trinidad and Tobago Dollar',
    symbol: 'TT$'
  },
  TVD: {
    currency: 'Tuvalu Dollar'
  },
  BTC: {
    currency: 'Bitcoin'
  },
  TWD: {
    currency: 'Taiwan New Dollar',
    symbol: 'NT$'
  },
  TZS: {
    currency: 'Tanzania Shilling',
    symbol: 'TSh'
  },
  UAH: {
    currency: 'Ukraine Hryvna',
    symbol: '₴'
  },
  UGX: {
    currency: 'Uganda Shilling',
    symbol: 'USh'
  },
  USD: {
    currency: 'United States Dollar',
    symbol: '$'
  },
  UYU: {
    currency: 'Uruguay Peso',
    symbol: '$U'
  },
  UZS: {
    currency: 'Uzbekistan Som',
    symbol: 'UZS'
  },
  VEF: {
    currency: 'Venezuela Bolivar',
    symbol: 'Bs.F.'
  },
  VND: {
    currency: 'Viet Nam Dong',
    symbol: '₫'
  },
  VUV: {
    currency: 'Vanuatu Vatu'
  },
  WST: {
    currency: 'Samoa Tala'
  },
  XAF: {
    currency: 'Communauté Financière Africaine (BEAC) CFA Franc BEAC',
    symbol: 'FCFA'
  },
  XCD: {
    currency: 'East Caribbean Dollar'
  },
  XDR: {
    currency: 'International Monetary Fund (IMF) Special Drawing Rights'
  },
  XOF: {
    currency: 'Communauté Financière Africaine (BCEAO) Franc',
    symbol: 'CFA'
  },
  XPF: {
    currency: 'Comptoirs Français du Pacifique (CFP) Franc'
  },
  YER: {
    currency: 'Yemen Rial',
    symbol: 'YR'
  },
  ZAR: {
    currency: 'South Africa Rand',
    symbol: 'R'
  },
  ZMW: {
    currency: 'Zambia Kwacha'
  },
  ZWD: {
    currency: 'Zimbabwe Dollar'
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
      var chartDefaults, updateChart;
      chartDefaults = {
        chart: {
          renderTo: element[0],
          type: attrs.type || null,
          height: attrs.height || null,
          width: attrs.width || null
        },
        colors: ['rgba(200,0,0,0.6)']
      };
      updateChart = function(value) {
        var chart, newSettings, updater;
        console.log('update Chart');
        if (!value) {
          return;
        }
        updater = $scope.chartData.updater;
        delete $scope.chartData.updater;
        newSettings = {};
        angular.extend(newSettings, chartDefaults, $scope.chartData);
        if (updater) {
          newSettings.chart.events = {
            load: updater
          };
        }
        return chart = new Highcharts.StockChart(newSettings);
      };
      return $scope.$watch((function() {
        return attrs.color;
      }), function(color) {
        chartDefaults.chart.backgroundColor = color === 'light' ? 'white' : 'black';
        return updateChart($scope.chartData);
      });
    }
  };
}).directive('resizable', function($window) {
  return function($scope, $element) {
    $scope.initializeElementSize = function() {
      $scope.elementHeight = $element.innerHeight;
      return $scope.elementWidth = $element.innerWidth;
    };
    $scope.initializeElementSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeElementSize();
      return $scope.$apply();
    });
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
    templateUrl: 'partials/trade/index',
    controller: 'TradeCtrl',
    authenticate: true
  }).state('login', {
    controller: 'LoginCtrl'
  }).state('logout', {
    url: '/logout',
    controller: 'LogoutCtrl'
  });
  return $urlRouterProvider.otherwise('/');
}).run([
  '$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
    return Auth.monitor();
  }
]);
