import React, { useEffect, useState } from 'react';

const Profile = ({ auth }) => {
  const [profile, setProfile] = useState(null);
  // const [error, setError] = useState('');

  const loadUserProfile = () => {
    auth.getProfile((profile, error) => {
      console.log('profile', profile);
      setProfile(profile);
      // setError(error);
    });
  };

  useEffect(loadUserProfile, [auth]);

  if (!profile) return null;
  return (
    <>
      <h1>Profile</h1>
      <p>{profile.nickname}</p>
      <img
        src={profile.picture}
        style={{ maxWidth: 50, maxHeight: 50 }}
        alt='Profile pic'
      />
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  );
};

export default Profile;
