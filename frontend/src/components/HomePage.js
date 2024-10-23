import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import AuthorizationButton from './AuthorizationButton';

const HomePage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        textAlign: 'center',
        padding: 4,
        borderRadius: 2,
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ fontWeight: 'bold', marginBottom: 2 }}
      >
        Welcome
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ marginBottom: 4 }}
      >
        Click the button below to proceed with your authorization.
      </Typography>

      <AuthorizationButton />
    </Container>
  );
};

export default HomePage;
