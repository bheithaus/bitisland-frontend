# Services
angular.module 'BI.services'

.factory 'Session', ($resource) ->
  $resource '/authentication'

.factory 'User', ($resource) ->
  $resource '/register'

.factory 'Order', ($resource) ->
  $resource '/api/orders'

.service 'socket', (UserSession) ->
  io.connect window.location.origin, { query: 'token=' + UserSession.loggedIn() }

.service 'UserSession', ($window) ->
  current = $window.sessionStorage.token
  
  session = 
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

.factory 'authInterceptor', ($rootScope, $q, $window, $location, UserSession) ->
  request: (config) ->
    config.headers = config.headers or {}
    if UserSession.loggedIn() and config.url.match /^\/api/
      config.headers.Authorization = 'Bearer ' + UserSession.loggedIn()
    
    config

  responseError: (response) ->
    if response.status is 401
      UserSession.logout()
      $location.path '/'

    response or $q.when response

.factory 'currentOrder', () ->
  currentOrder = {}

  getSet = 
    get: ->
      currentOrder

    set: (order) ->
      console.log 'set to ', order
      currentOrder = order


.service 'selectedCurrency', () ->
  selectedCurrency =
    listeners: []
    value: { rate: 1, code: 'USD', name: 'United States Dollars' }

    set: (selection) ->
      console.log 'set to', selection
      selectedCurrency.value = selection
      @notify()

    get: ->
      @value
      
    change: (cb) ->
      #  register a listener
      @listeners.push cb if typeof cb is 'function'
    
    notify: ->
      for listener in @listeners
        listener(@value)


.factory 'currencyChoices', ($http, selectedCurrency) ->
  Currency_url = "http://openexchangerates.org/api/latest.json?app_id=7b929627965a44329df5a6c0b8898a8e"
  completedCurrencyChoices = {
    obj: {}
    array: []
  }
  USD = null

  xRates = $http.get Currency_url
  .success (data) ->
    for code, xRate of data.rates
      currency = {}
      currency.rate = xRate

      if CURRENCY_NAMES[code]
        currency.name = CURRENCY_NAMES[code].currency
        currency.code = code
        completedCurrencyChoices.array.push currency
        completedCurrencyChoices.obj[code] = currency

        USD = currency if code is 'USD' 

    currencyChoices.array = completedCurrencyChoices.array
    currencyChoices.obj = completedCurrencyChoices.obj
    currencyChoices.notify()
    selectedCurrency.set USD

  .error (data) ->
    console.log 'data', data

  currencyChoices =
    changed: (cb) ->
      @cb = cb
    
    notify: ->
      @cb currencyChoices.array


CURRENCY_NAMES = {
    'AED': { currency: "United Arab Emirates Dirham" }
    'AFN': { currency: "Afghanistan Afghani" }
    'ALL': { currency: "Albania Lek" }
    'AMD': { currency: "Armenia Dram" }
    'ANG': { currency: "Netherlands Antilles Guilder" }
    'AOA': { currency: "Angola Kwanza" }
    'ARS': { currency: "Argentina Peso" }
    'AUD': { currency: "Australia Dollar" }
    'AWG': { currency: "Aruba Guilder" }
    'AZN': { currency: "Azerbaijan New Manat" }
    'BAM': { currency: "Bosnia and Herzegovina Convertible Marka" }
    'BBD': { currency: "Barbados Dollar" }
    'BDT': { currency: "Bangladesh Taka" }
    'BGN': { currency: "Bulgaria Lev" }
    'BHD': { currency: "Bahrain Dinar" }
    'BIF': { currency: "Burundi Franc" }
    'BMD': { currency: "Bermuda Dollar" }
    'BND': { currency: "Brunei Darussalam Dollar" }
    'BOB': { currency: "Bolivia Boliviano" }
    'BRL': { currency: "Brazil Real" }
    'BSD': { currency: "Bahamas Dollar" }
    'BTN': { currency: "Bhutan Ngultrum" }
    'BWP': { currency: "Botswana Pula" }
    'BYR': { currency: "Belarus Ruble" }
    'BZD': { currency: "Belize Dollar" }
    'CAD': { currency: "Canada Dollar" }
    'CDF': { currency: "Congo/Kinshasa Franc" }
    'CHF': { currency: "Switzerland Franc" }
    'CLP': { currency: "Chile Peso" }
    'CNY': { currency: "China Yuan Renminbi" }
    'COP': { currency: "Colombia Peso" }
    'CRC': { currency: "Costa Rica Colon" }
    'CUC': { currency: "Cuba Convertible Peso" }
    'CUP': { currency: "Cuba Peso" }
    'CVE': { currency: "Cape Verde Escudo" }
    'CZK': { currency: "Czech Republic Koruna" }
    'DJF': { currency: "Djibouti Franc" }
    'DKK': { currency: "Denmark Krone" }
    'DOP': { currency: "Dominican Republic Peso" }
    'DZD': { currency: "Algeria Dinar" }
    'EGP': { currency: "Egypt Pound" }
    'ERN': { currency: "Eritrea Nakfa" }
    'ETB': { currency: "Ethiopia Birr" }
    'EUR': { currency: "Euro Member Countries" }
    'FJD': { currency: "Fiji Dollar" }
    'FKP': { currency: "Falkland Islands (Malvinas) Pound" }
    'GBP': { currency: "United Kingdom Pound" }
    'GEL': { currency: "Georgia Lari" }
    'GGP': { currency: "Guernsey Pound" }
    'GHS': { currency: "Ghana Cedi" }
    'GIP': { currency: "Gibraltar Pound" }
    'GMD': { currency: "Gambia Dalasi" }
    'GNF': { currency: "Guinea Franc" }
    'GTQ': { currency: "Guatemala Quetzal" }
    'GYD': { currency: "Guyana Dollar" }
    'HKD': { currency: "Hong Kong Dollar" }
    'HNL': { currency: "Honduras Lempira" }
    'HRK': { currency: "Croatia Kuna" }
    'HTG': { currency: "Haiti Gourde" }
    'HUF': { currency: "Hungary Forint" }
    'IDR': { currency: "Indonesia Rupiah" }
    'ILS': { currency: "Israel Shekel" }
    'IMP': { currency: "Isle of Man Pound" }
    'INR': { currency: "India Rupee" }
    'IQD': { currency: "Iraq Dinar" }
    'IRR': { currency: "Iran Rial" }
    'ISK': { currency: "Iceland Krona" }
    'JEP': { currency: "Jersey Pound" }
    'JMD': { currency: "Jamaica Dollar" }
    'JOD': { currency: "Jordan Dinar" }
    'JPY': { currency: "Japan Yen" }
    'KES': { currency: "Kenya Shilling" }
    'KGS': { currency: "Kyrgyzstan Som" }
    'KHR': { currency: "Cambodia Riel" }
    'KMF': { currency: "Comoros Franc" }
    'KPW': { currency: "Korea (North) Won" }
    'KRW': { currency: "Korea (South) Won" }
    'KWD': { currency: "Kuwait Dinar" }
    'KYD': { currency: "Cayman Islands Dollar" }
    'KZT': { currency: "Kazakhstan Tenge" }
    'LAK': { currency: "Laos Kip" }
    'LBP': { currency: "Lebanon Pound" }
    'LKR': { currency: "Sri Lanka Rupee" }
    'LRD': { currency: "Liberia Dollar" }
    'LSL': { currency: "Lesotho Loti" }
    'LTL': { currency: "Lithuania Litas" }
    'LVL': { currency: "Latvia Lat" }
    'LYD': { currency: "Libya Dinar" }
    'MAD': { currency: "Morocco Dirham" }
    'MDL': { currency: "Moldova Leu" }
    'MGA': { currency: "Madagascar Ariary" }
    'MKD': { currency: "Macedonia Denar" }
    'MMK': { currency: "Myanmar (Burma) Kyat" }
    'MNT': { currency: "Mongolia Tughrik" }
    'MOP': { currency: "Macau Pataca" }
    'MRO': { currency: "Mauritania Ouguiya" }
    'MUR': { currency: "Mauritius Rupee" }
    'MVR': { currency: "Maldives (Maldive Islands) Rufiyaa" }
    'MWK': { currency: "Malawi Kwacha" }
    'MXN': { currency: "Mexico Peso" }
    'MYR': { currency: "Malaysia Ringgit" }
    'MZN': { currency: "Mozambique Metical" }
    'NAD': { currency: "Namibia Dollar" }
    'NGN': { currency: "Nigeria Naira" }
    'NIO': { currency: "Nicaragua Cordoba" }
    'NOK': { currency: "Norway Krone" }
    'NPR': { currency: "Nepal Rupee" }
    'NZD': { currency: "New Zealand Dollar" }
    'OMR': { currency: "Oman Rial" }
    'PAB': { currency: "Panama Balboa" }
    'PEN': { currency: "Peru Nuevo Sol" }
    'PGK': { currency: "Papua New Guinea Kina" }
    'PHP': { currency: "Philippines Peso" }
    'PKR': { currency: "Pakistan Rupee" }
    'PLN': { currency: "Poland Zloty" }
    'PYG': { currency: "Paraguay Guarani" }
    'QAR': { currency: "Qatar Riyal" }
    'RON': { currency: "Romania New Leu" }
    'RSD': { currency: "Serbia Dinar" }
    'RUB': { currency: "Russia Ruble" }
    'RWF': { currency: "Rwanda Franc" }
    'SAR': { currency: "Saudi Arabia Riyal" }
    'SBD': { currency: "Solomon Islands Dollar" }
    'SCR': { currency: "Seychelles Rupee" }
    'SDG': { currency: "Sudan Pound" }
    'SEK': { currency: "Sweden Krona" }
    'SGD': { currency: "Singapore Dollar" }
    'SHP': { currency: "Saint Helena Pound" }
    'SLL': { currency: "Sierra Leone Leone" }
    'SOS': { currency: "Somalia Shilling" }
    # # 'SP: { currencyL':*"  Seborga Luigino" }
    'SRD': { currency: "Suriname Dollar" }
    'STD': { currency: "São Tomé and Príncipe Dobra" }
    'SVC': { currency: "El Salvador Colon" }
    'SYP': { currency: "Syria Pound" }
    'SZL': { currency: "Swaziland Lilangeni" }
    'THB': { currency: "Thailand Baht" }
    'TJS': { currency: "Tajikistan Somoni" }
    'TMT': { currency: "Turkmenistan Manat" }
    'TND': { currency: "Tunisia Dinar" }
    'TOP': { currency: "Tonga Pa'anga" }
    'TRY': { currency: "Turkey Lira" }
    'TTD': { currency: "Trinidad and Tobago Dollar" }
    'TVD': { currency: "Tuvalu Dollar" }
    'TWD': { currency: "Taiwan New Dollar" }
    'TZS': { currency: "Tanzania Shilling" }
    'UAH': { currency: "Ukraine Hryvna" }
    'UGX': { currency: "Uganda Shilling" }
    'USD': { currency: "United States Dollar" }
    'UYU': { currency: "Uruguay Peso" }
    'UZS': { currency: "Uzbekistan Som" }
    'VEF': { currency: "Venezuela Bolivar" }
    'VND': { currency: "Viet Nam Dong" }
    'VUV': { currency: "Vanuatu Vatu" }
    'WST': { currency: "Samoa Tala" }
    'XAF': { currency: "Communauté Financière Africaine (BEAC) CFA Franc BEAC" }
    'XCD': { currency: "East Caribbean Dollar" }
    'XDR': { currency: "International Monetary Fund (IMF) Special Drawing Rights" }
    'XOF': { currency: "Communauté Financière Africaine (BCEAO) Franc" }
    'XPF': { currency: "Comptoirs Français du Pacifique (CFP) Franc" }
    'YER': { currency: "Yemen Rial" }
    'ZAR': { currency: "South Africa Rand" }
    'ZMW': { currency: "Zambia Kwacha" }
    'ZWD': { currency: "Zimbabwe Dollar"}
  }