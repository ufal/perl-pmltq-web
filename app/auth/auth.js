
module.exports = class AuthService {

  constructor($rootScope, $http, $cacheFactory, authService, Restangular) {
    'ngInject';

    this.loggedInFlag = false;
    this.user = {};
    this.authService = authService;

    this.httpCache = $http.defaults.cache = $cacheFactory('pmltqHttpCache');
    var restangular = Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setDefaultHttpFields({cache: false});
    });
    this.authApi = restangular.service('auth');
    this.scope = $rootScope;

    this.scope.$on('event:auth-loginConfirmed', () => {
      this.loggedIn = true;
    });
  }

  get loggedIn() {
    return this.loggedInFlag;
  }

  set loggedIn(value) {
    if (value !== this.loggedInFlag) {
      this.loggedInFlag = value;
      this.httpCache.removeAll(); // Status has changed, clear cache
    }
  }

  ping() {
    return this.authApi.one().get().then((authData) => {
      this.login_with = authData.login_with;
      if (authData.user === false) {
        this.loggedIn = false;
      } else {
        this.user = authData.user;
        this.authService.loginConfirmed(this.user);
      }
    }, () => {
      this.loggedIn = false;
      this.user = {};
    });
  }

  login(params) {
    return this.authApi.post({auth: {username: params.username, password: params.password}}).then((authData) => {
      this.user = authData.user;
      this.authService.loginConfirmed(this.user);
      return this.user;
    });
  }

  logout() {
    return this.authApi.one().remove().then(() => {
      this.loggedIn = false;
      this.user = {};
      this.scope.$broadcast('event:auth-loggedOut');
    });
  }
};

