/** @type Rx  */
var Rx = require('rx');

module.exports = class AuthService {

  constructor($rootScope, authService, Restangular) {
    //noinspection BadExpressionStatementJS
    'ngInject';

    this._loggedIn = false;
    this.status = new Rx.BehaviorSubject(this._loggedIn);
    this.user = {};
    this.authService = authService;
    this.authApi = Restangular.service('auth');
    this.scope = $rootScope;

    this.scope.$on('event:auth-loginConfirmed', () => { this.loggedIn = true; });
  }

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(value) {
    this._loggedIn = value;
    this.status.onNext(value);
  }

  ping() {
    return this.authApi.one().get().then((authData) => {
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

