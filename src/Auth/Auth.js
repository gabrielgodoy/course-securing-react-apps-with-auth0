import auth0 from 'auth0-js';

const REDIRECT_ON_LOGIN = 'redirect_on_login';

// STORE TOKENS IN MEMORY (NOT localStorage)
// Stored outside class since is private
// eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
/*
  We're storing expires_at and scopes in localStorage just for convenience,
  so we don't have to parse the JWT on the client to use this data for UI-related logic
*/
let _scopes = null;
let _expiresAt = null;

export default class Auth {
  // History from react-router, so Auth can perform redirects
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = 'openid profile email read:courses';
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      // token give us to an access token so the user can make API calls
      // id_token give us a JWT token to authenticate the user when they login
      responseType: 'token id_token',
      scope: this.requestedScopes,
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );

    // When authorize() is called it will redirect the browser to the auth0 login page
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);

        // Redirect to the previous url after login
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === 'undefined'
            ? '/'
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));

        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check the console for further details`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  // Set auth variables to localstorage
  setSession = (authResult) => {
    // Set the time that the access token will expire
    _expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    _scopes = authResult.scope || this.requestedScopes || '';

    _accessToken = authResult.accessToken;
    // eslint-disable-next-line
    _idToken = authResult.idToken;

    this.scheduleTokenRenewal();
  };

  isAuthenticated = () => {
    return new Date().getTime() < _expiresAt;
  };

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: 'http://localhost:3000',
    });
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error('No access token found.');
    }
    return _accessToken;
  };

  getProfile = (cb) => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(profile, err);
    });
  };

  userHasScopes(scopes) {
    const grantedScopes = (_scopes || '').split(' ');
    return scopes.every((scope) => grantedScopes.includes(scope));
  }

  // For silent authentication
  // We need to call this before the app is displayed so we know the user is logged in
  // And we need to complete this check before the app renders
  renewToken(cb) {
    console.log('RENEW?');
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      if (cb) {
        cb(err, result);
      }
    });
  }

  // Silent Token renewal
  // Request new token automatically when user current token expires
  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now();
    if (delay > 0) {
      setTimeout(() => this.renewToken(), delay);
    }
  }
}
