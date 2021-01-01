import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ auth }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/profile'>Profile</Link>
        </li>
        <li>
          <Link to='/public'>Public</Link>
        </li>
        {auth.isAuthenticated() && (
          <li>
            <Link to='/private'>Private</Link>
          </li>
        )}
        {auth.isAuthenticated() && auth.userHasScopes(['read:courses']) && (
          <li>
            <Link to='/courses'>Courses</Link>
          </li>
        )}
        <li>
          <button onClick={auth.isAuthenticated() ? auth.logout : auth.login}>
            {auth.isAuthenticated() ? 'Log Out' : 'Log In'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
