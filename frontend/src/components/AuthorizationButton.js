import React from 'react';
import { Button } from '@mui/material';

const clientId = 'KGCD5ryo5PMEPI0I5jI5KkGgon2qtizfkumuN5wm';
const redirectUri = 'https://drchronos-report-front.onrender.com/oauth-callback';
const scope = 'labs:read messages:read patients:read patients:summary:read settings:read tasks:read user:read billing:patient-payment:read billing:read calendar:read clinical:read'; // Adjust the scope based on your needs

const authorizationUrl = `https://drchrono.com/o/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

const AuthorizationButton = () => {
  const handleAuthorization = () => {
    window.location.href = authorizationUrl;
  };

  return (
    <Button variant='contained' size='medium' onClick={handleAuthorization}>
      Authorize with DrChrono
    </Button>
  );
};

export default AuthorizationButton;


