import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthorizationCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      // Send the authorization code to the backend
      axios.post('https://drchronos-report.onrender.com/exchange-code', { code })
        .then(response => {
          console.log('Access Token:', response.data.access_token);
          // Store the access token
          localStorage.setItem('access_token', response.data.access_token);
          // Redirect the user to the dashboard or a different page
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error exchanging code:', error);
        });
    } else {
      console.error('Authorization code not found');
    }
  }, [location, navigate]);

  return <h2>Processing Authorization...</h2>;
};

export default AuthorizationCallback;
