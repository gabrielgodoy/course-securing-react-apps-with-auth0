import React, { useEffect } from 'react';

const Callback = ({ auth, location }) => {
  useEffect(() => {
    // Handle authentication if expected values are in the url

    // This regex confirms that at least one of these 3 expected values are in the URL
    if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
    } else {
      throw new Error('Invalid callback URL.');
    }
  }, [auth, location.hash]);

  return <h1>Loading...</h1>;
};

export default Callback;
