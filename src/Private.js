import React, { useEffect, useState } from 'react';

const Private = ({ auth }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/private', {
      headers: {
        Authorization: `Bearer ${auth.getAccessToken()}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response is not ok.');
        }
      })
      .then((response) => setMessage(response.message))
      .catch((error) => setMessage(error.message));
  }, [auth]);

  return <p>{message}</p>;
};

export default Private;
