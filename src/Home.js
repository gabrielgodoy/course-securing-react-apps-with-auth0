import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ auth }) => {
  return (
    <div>
      <h1>Home</h1>
      {auth.isAuthenticated() ? (
        <Link to='/profile'>View profile</Link>
      ) : (
        <button onClick={auth.login}>Login</button>
      )}
    </div>
  );
};

export default Home;
