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

.service 'LatestTrade', () ->
  latest = {}

  set: (data) ->
    latest = data
  
  get: ->
    latest

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
      #console.log 'set to ', order
      currentOrder = order


.service 'selectedCurrency', () ->
  selectedCurrency =
    listeners: []
    value: { rate: 1, code: 'USD', name: 'United States Dollars' }

    set: (selection) ->
      #console.log 'set to', selection
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
        currency.sym = CURRENCY_NAMES[code].symbol
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
  AED: { currency: 'United Arab Emirates Dirham', symbol: 'AED' },
  AFN: { currency: 'Afghanistan Afghani', symbol: 'Af' },
  ALL: { currency: 'Albania Lek', symbol: 'ALL' },
  AMD: { currency: 'Armenia Dram', symbol: 'AMD' },
  ANG: { currency: 'Netherlands Antilles Guilder' },
  AOA: { currency: 'Angola Kwanza' },
  ARS: { currency: 'Argentina Peso', symbol: 'AR$' },
  AUD: { currency: 'Australia Dollar', symbol: 'AU$' },
  AWG: { currency: 'Aruba Guilder' },
  AZN: { currency: 'Azerbaijan New Manat', symbol: 'man.' },
  BAM: { currency: 'Bosnia and Herzegovina Convertible Marka', symbol: 'KM' },
  BBD: { currency: 'Barbados Dollar' },
  BDT: { currency: 'Bangladesh Taka', symbol: 'Tk' },
  BGN: { currency: 'Bulgaria Lev', symbol: 'BGN' },
  BHD: { currency: 'Bahrain Dinar', symbol: 'BD' },
  BIF: { currency: 'Burundi Franc', symbol: 'FBu' },
  BMD: { currency: 'Bermuda Dollar' },
  BND: { currency: 'Brunei Darussalam Dollar', symbol: 'BN$' },
  BOB: { currency: 'Bolivia Boliviano', symbol: 'Bs' },
  BRL: { currency: 'Brazil Real', symbol: 'R$' },
  BSD: { currency: 'Bahamas Dollar' },
  BTN: { currency: 'Bhutan Ngultrum' },
  BWP: { currency: 'Botswana Pula', symbol: 'BWP' },
  BYR: { currency: 'Belarus Ruble', symbol: 'BYR' },
  BZD: { currency: 'Belize Dollar', symbol: 'BZ$' },
  CAD: { currency: 'Canada Dollar', symbol: 'CA$' },
  CDF: { currency: 'Congo/Kinshasa Franc', symbol: 'CDF' },
  CHF: { currency: 'Switzerland Franc', symbol: 'CHF' },
  CLP: { currency: 'Chile Peso', symbol: 'CL$' },
  CNY: { currency: 'China Yuan Renminbi', symbol: 'CN¥' },
  COP: { currency: 'Colombia Peso', symbol: 'CO$' },
  CRC: { currency: 'Costa Rica Colon', symbol: '₡' },
  CUC: { currency: 'Cuba Convertible Peso' },
  CUP: { currency: 'Cuba Peso' },
  CVE: { currency: 'Cape Verde Escudo', symbol: 'CV$' },
  CZK: { currency: 'Czech Republic Koruna', symbol: 'Kč' },
  DJF: { currency: 'Djibouti Franc', symbol: 'Fdj' },
  DKK: { currency: 'Denmark Krone', symbol: 'Dkr' },
  DOP: { currency: 'Dominican Republic Peso', symbol: 'RD$' },
  DZD: { currency: 'Algeria Dinar', symbol: 'DA' },
  EGP: { currency: 'Egypt Pound', symbol: 'EGP' },
  ERN: { currency: 'Eritrea Nakfa', symbol: 'Nfk' },
  ETB: { currency: 'Ethiopia Birr', symbol: 'Br' },
  EUR: { currency: 'Euro Member Countries', symbol: '€' },
  FJD: { currency: 'Fiji Dollar' },
  FKP: { currency: 'Falkland Islands (Malvinas) Pound' },
  GBP: { currency: 'United Kingdom Pound', symbol: '£' },
  GEL: { currency: 'Georgia Lari', symbol: 'GEL' },
  GGP: { currency: 'Guernsey Pound' },
  GHS: { currency: 'Ghana Cedi', symbol: 'GH₵' },
  GIP: { currency: 'Gibraltar Pound' },
  GMD: { currency: 'Gambia Dalasi' },
  GNF: { currency: 'Guinea Franc', symbol: 'FG' },
  GTQ: { currency: 'Guatemala Quetzal', symbol: 'GTQ' },
  GYD: { currency: 'Guyana Dollar' },
  HKD: { currency: 'Hong Kong Dollar', symbol: 'HK$' },
  HNL: { currency: 'Honduras Lempira', symbol: 'HNL' },
  HRK: { currency: 'Croatia Kuna', symbol: 'kn' },
  HTG: { currency: 'Haiti Gourde' },
  HUF: { currency: 'Hungary Forint', symbol: 'Ft' },
  IDR: { currency: 'Indonesia Rupiah', symbol: 'Rp' },
  ILS: { currency: 'Israel Shekel', symbol: '₪' },
  IMP: { currency: 'Isle of Man Pound' },
  INR: { currency: 'India Rupee', symbol: 'Rs' },
  IQD: { currency: 'Iraq Dinar', symbol: 'IQD' },
  IRR: { currency: 'Iran Rial', symbol: 'IRR' },
  ISK: { currency: 'Iceland Krona', symbol: 'Ikr' },
  JEP: { currency: 'Jersey Pound' },
  JMD: { currency: 'Jamaica Dollar', symbol: 'J$' },
  JOD: { currency: 'Jordan Dinar', symbol: 'JD' },
  JPY: { currency: 'Japan Yen', symbol: '¥' },
  KES: { currency: 'Kenya Shilling', symbol: 'Ksh' },
  KGS: { currency: 'Kyrgyzstan Som' },
  KHR: { currency: 'Cambodia Riel', symbol: 'KHR' },
  KMF: { currency: 'Comoros Franc', symbol: 'CF' },
  KPW: { currency: 'Korea (North) Won' },
  KRW: { currency: 'Korea (South) Won', symbol: '₩' },
  KWD: { currency: 'Kuwait Dinar', symbol: 'KD' },
  KYD: { currency: 'Cayman Islands Dollar' },
  KZT: { currency: 'Kazakhstan Tenge', symbol: 'KZT' },
  LAK: { currency: 'Laos Kip' },
  LBP: { currency: 'Lebanon Pound', symbol: 'LB£' },
  LKR: { currency: 'Sri Lanka Rupee', symbol: 'SLRs' },
  LRD: { currency: 'Liberia Dollar' },
  LSL: { currency: 'Lesotho Loti' },
  LTL: { currency: 'Lithuania Litas', symbol: 'Lt' },
  LVL: { currency: 'Latvia Lat', symbol: 'Ls' },
  LYD: { currency: 'Libya Dinar', symbol: 'LD' },
  MAD: { currency: 'Morocco Dirham', symbol: 'MAD' },
  MDL: { currency: 'Moldova Leu', symbol: 'MDL' },
  MGA: { currency: 'Madagascar Ariary', symbol: 'MGA' },
  MKD: { currency: 'Macedonia Denar', symbol: 'MKD' },
  MMK: { currency: 'Myanmar (Burma) Kyat', symbol: 'MMK' },
  MNT: { currency: 'Mongolia Tughrik' },
  MOP: { currency: 'Macau Pataca', symbol: 'MOP$' },
  MRO: { currency: 'Mauritania Ouguiya' },
  MUR: { currency: 'Mauritius Rupee', symbol: 'MURs' },
  MVR: { currency: 'Maldives (Maldive Islands) Rufiyaa' },
  MWK: { currency: 'Malawi Kwacha' },
  MXN: { currency: 'Mexico Peso', symbol: 'MX$' },
  MYR: { currency: 'Malaysia Ringgit', symbol: 'RM' },
  MZN: { currency: 'Mozambique Metical', symbol: 'MTn' },
  NAD: { currency: 'Namibia Dollar', symbol: 'N$' },
  NGN: { currency: 'Nigeria Naira', symbol: '₦' },
  NIO: { currency: 'Nicaragua Cordoba', symbol: 'C$' },
  NOK: { currency: 'Norway Krone', symbol: 'Nkr' },
  NPR: { currency: 'Nepal Rupee', symbol: 'NPRs' },
  NZD: { currency: 'New Zealand Dollar', symbol: 'NZ$' },
  OMR: { currency: 'Oman Rial', symbol: 'OMR' },
  PAB: { currency: 'Panama Balboa', symbol: 'B/.' },
  PEN: { currency: 'Peru Nuevo Sol', symbol: 'S/.' },
  PGK: { currency: 'Papua New Guinea Kina' },
  PHP: { currency: 'Philippines Peso', symbol: '₱' },
  PKR: { currency: 'Pakistan Rupee', symbol: 'PKRs' },
  PLN: { currency: 'Poland Zloty', symbol: 'zł' },
  PYG: { currency: 'Paraguay Guarani', symbol: '₲' },
  QAR: { currency: 'Qatar Riyal', symbol: 'QR' },
  RON: { currency: 'Romania New Leu', symbol: 'RON' },
  RSD: { currency: 'Serbia Dinar', symbol: 'din.' },
  RUB: { currency: 'Russia Ruble', symbol: 'RUB' },
  RWF: { currency: 'Rwanda Franc', symbol: 'RWF' },
  SAR: { currency: 'Saudi Arabia Riyal', symbol: 'SR' },
  SBD: { currency: 'Solomon Islands Dollar' },
  SCR: { currency: 'Seychelles Rupee' },
  SDG: { currency: 'Sudan Pound', symbol: 'SDG' },
  SEK: { currency: 'Sweden Krona', symbol: 'Skr' },
  SGD: { currency: 'Singapore Dollar', symbol: 'S$' },
  SHP: { currency: 'Saint Helena Pound' },
  SLL: { currency: 'Sierra Leone Leone' },
  SOS: { currency: 'Somalia Shilling', symbol: 'Ssh' },
  SRD: { currency: 'Suriname Dollar' },
  STD: { currency: 'São Tomé and Príncipe Dobra' },
  SVC: { currency: 'El Salvador Colon' },
  SYP: { currency: 'Syria Pound', symbol: 'SY£' },
  SZL: { currency: 'Swaziland Lilangeni' },
  THB: { currency: 'Thailand Baht', symbol: '฿' },
  TJS: { currency: 'Tajikistan Somoni' },
  TMT: { currency: 'Turkmenistan Manat' },
  TND: { currency: 'Tunisia Dinar', symbol: 'DT' },
  TOP: { currency: 'Tonga Pa\'anga', symbol: 'T$' },
  TRY: { currency: 'Turkey Lira', symbol: 'TL' },
  TTD: { currency: 'Trinidad and Tobago Dollar', symbol: 'TT$' },
  TVD: { currency: 'Tuvalu Dollar' },
  BTC: { currency: 'Bitcoin' },
  TWD: { currency: 'Taiwan New Dollar', symbol: 'NT$' },
  TZS: { currency: 'Tanzania Shilling', symbol: 'TSh' },
  UAH: { currency: 'Ukraine Hryvna', symbol: '₴' },
  UGX: { currency: 'Uganda Shilling', symbol: 'USh' },
  USD: { currency: 'United States Dollar', symbol: '$' },
  UYU: { currency: 'Uruguay Peso', symbol: '$U' },
  UZS: { currency: 'Uzbekistan Som', symbol: 'UZS' },
  VEF: { currency: 'Venezuela Bolivar', symbol: 'Bs.F.' },
  VND: { currency: 'Viet Nam Dong', symbol: '₫' },
  VUV: { currency: 'Vanuatu Vatu' },
  WST: { currency: 'Samoa Tala' },
  XAF: { currency: 'Communauté Financière Africaine (BEAC) CFA Franc BEAC', symbol: 'FCFA' },
  XCD: { currency: 'East Caribbean Dollar' },
  XDR: { currency: 'International Monetary Fund (IMF) Special Drawing Rights' },
  XOF: { currency: 'Communauté Financière Africaine (BCEAO) Franc', symbol: 'CFA' },
  XPF: { currency: 'Comptoirs Français du Pacifique (CFP) Franc' },
  YER: { currency: 'Yemen Rial', symbol: 'YR' },
  ZAR: { currency: 'South Africa Rand', symbol: 'R' },
  ZMW: { currency: 'Zambia Kwacha' },
  ZWD: { currency: 'Zimbabwe Dollar' } }