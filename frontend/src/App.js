// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';  
import OAuthCallback from './components/OAuthCallback';
import Dashboard from './components/Dashboard';

const App = () => {
  // const getOAuthCode = () => {
  //   const query = new URLSearchParams(window.location.search);
  //   return query.get('code');
  // };

  return (
    <Routes>
        <Route path="/" element={<HomePage />} /> {/* Renders AuthorizationButton at "/" */}
        {/* <Route path="/oauth-callback" render={() => <OAuthCallback code={getOAuthCode()} />} /> */}
        <Route path="/oauth-callback" element={<OAuthCallback />} />
{/* 
        <Route path="/oauth-callback" element={<AuthorizationCallback />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
