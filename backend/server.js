// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const app = express();

// app.use(bodyParser.json());

// // Function to exchange authorization code for access token
// const exchangeCode = async (authCode) => {
//   const clientId = 'KGCD5ryo5PMEPI0I5jI5KkGgon2qtizfkumuN5wm';
//   const clientSecret = 'PndtJOg7t5vRkyQhTfHqbhnCv5SZ9r1V3vZNjsAyLs0rhRwcObcZQMQX4xlZPlbA0qBRfX0tuYby2koSLR5t2CIyjVpuEwbyBCActJy61nEQZBmxcCLxJwo6q6Vx8hfA';
//   const redirectUri = 'http://localhost:3000/oauth-callback'; // Ensure this matches your app's redirect URI

//   try {
//     const response = await axios.post('https://drchrono.com/o/token/', new URLSearchParams({
//       grant_type: 'authorization_code',
//       client_id: clientId,
//       client_secret: clientSecret,
//       redirect_uri: redirectUri,
//       code: authCode, // Use the provided authorization code
//     }), {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     });

//     const { access_token } = response.data; // Extract the access token from the response
//     return access_token; // Return the access token
//   } catch (error) {
//     console.error('Error exchanging code:', error.response ? error.response.data : error.message);
//     throw new Error('Error exchanging code for token');
//   }
// };

// // Endpoint to handle the exchange code request using GET
// app.get('/exchange-code', async (req, res) => {
//   const code = req.query.code; // Get the authorization code from the query string
//   if (!code) {
//     return res.status(400).send('Authorization code is required');
//   }

//   try {
//     const accessToken = await exchangeCode(code); // Call the exchangeCode function
//     res.json({ access_token: accessToken }); // Send the access token back as a JSON response
//   } catch (error) {
//     res.status(500).send(error.message); // Handle errors
//   }
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });

// // Example usage: Uncomment the following lines to call the function directly for testing
// const authCode = 'Qz2VbhvrpW19XKzjm6T82xPGZy9LEx'; // Replace with the actual code you received
// exchangeCode(authCode).then(token => {
//   console.log('Access Token:', token);
// }).catch(err => {
//   console.error(err.message);
// });


const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();

// CORS options to handle preflight requests
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS method
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
  credentials: true, // Allow credentials if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Allow preflight requests for all routes
app.options('*', cors(corsOptions));

// Middleware to log incoming headers for debugging
app.use((req, res, next) => {
  console.log('Received Headers:', req.headers); // Debug log
  next();
});

const proxyRoutes = require('./proxyRoutes.js'); 
app.use('/api', proxyRoutes);
// Import and use appointment routes
const appointmentRoutes = require('./appointment.js'); 
app.use('/api', appointmentRoutes);

const denialReportRoute = require('./denialReport.js');
app.use('/api', denialReportRoute);

const paymentAnalysisRoute = require('./paymentAnalysisReport.js');
app.use('/api', paymentAnalysisRoute);

const chargeReportRoute = require('./chargeReport.js');
app.use('/api', chargeReportRoute);




// Body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Endpoint to exchange the authorization code for an access token
app.post('/exchange-code', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).send('Authorization code is required');
  }

  // const clientId = 'KPxwLsdr7EBH34tmiTEKAojT2KwyLJI48n9eUP47';
  // const clientSecret = 'PndtJOg7t5vRkyQhTfHqbhnCv5SZ9r1V3vZNjsAyLs0rhRwcObcZQMQX4xlZPlbA0qBRfX0tuYby2koSLR5t2CIyjVpuEwbyBCActJy61nEQZBmxcCLxJwo6q6Vx8hfA';
  const clientId = 'KPxwLsdr7EBH34tmiTEKAojT2KwyLJI48n9eUP47';
  const clientSecret = '1YycM1FyoA9Felc2Vy4ESbJd9dqAmyegk4SSOTqRO8kVupOpSogCatTR6miAlEAQHlIysV6jjOqnA7JoJiALrOEna4XvEusf5EbUdN5M6TNALem76ripwVchQHuqWvny';
  const redirectUri = 'http://localhost:3000/oauth-callback';

  try {
    const response = await axios.post('https://drchrono.com/o/token/', new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = response.data;
    res.json({ access_token });
  } catch (error) {
    console.error('Error exchanging code:', error.response ? error.response.data : error.message);
    res.status(500).send('Error exchanging code for token');
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
