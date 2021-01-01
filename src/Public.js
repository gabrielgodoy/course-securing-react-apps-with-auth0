import React, { useEffect, useState } from 'react';

const Public = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/public')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response is not ok.');
        }
      })
      .then((response) => setMessage(response.message))
      .catch((error) => setMessage(error.message));
  }, []);

  return <p>{message}</p>;
};

export default Public;
