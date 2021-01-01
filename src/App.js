import React, { useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Callback from './Callback';
import Nav from './Nav';
import Public from './Public';
import Private from './Private';
import PrivateRoute from './PrivateRoute';
import Courses from './Courses';
import Auth from './Auth/Auth';
import AuthContext from './AuthContext';

function App({ history }) {
  const auth = useMemo(() => new Auth(history), [history]);

  // This will keep track of when our token renewal request has been completed
  const [tokenRenewalComplete, setTokenRenewalComplete] = useState(false);

  useEffect(() => {
    auth.renewToken(() => {
      setTokenRenewalComplete(true);
    });
  }, [auth]);

  // Show loading message until the token renewal check is completed.
  if (!tokenRenewalComplete) return 'Loading...';

  return (
    <AuthContext.Provider value={auth}>
      <Nav auth={auth} />
      <div className='body'>
        <Route
          path='/'
          exact
          render={(props) => <Home auth={auth} {...props} />}
        />
        <PrivateRoute path='/profile' component={Profile} />
        <PrivateRoute path='/private' component={Private} />
        <Route
          path='/callback'
          render={(props) => <Callback auth={auth} {...props} />}
        />
        <Route path='/public' component={Public} />
        <PrivateRoute
          path='/courses'
          component={Courses}
          scopes={['read:courses']}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
