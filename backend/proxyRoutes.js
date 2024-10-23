// backend/routes/proxyRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to fetch data from DrChrono API
const fetchData = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
    throw error;
  }
};

// Route to get offices
router.get('/offices', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing' });

  try {
    const officeData = await fetchData('https://app.drchrono.com/api/offices', token);
    const offices = officeData.results.map((office) => ({
      id: office.id,
      name: office.name,
    }));
    res.json(offices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offices' });
  }
});

// Route to get doctors
router.get('/doctors', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing' });

  try {
    const doctorsData = await fetchData('https://app.drchrono.com/api/doctors', token);
    // res.json(data.results);
    const doctors = doctorsData.results.map((doc) => ({
      id: doc.id,
      first_name: doc.first_name,
      last_name: doc.last_name,
    }));
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});

router.get('/appointment_profiles', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const profilesData = await fetchData('https://app.drchrono.com/api/appointment_profiles', token);
    const profiles = profilesData.results.map((profile) => ({
      id: profile.id,
      name: profile.name,
    }));
    res.json(profiles);

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profiles.' });
  }
});

router.get('/appointment_profiles', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const data = await fetchData('https://app.drchrono.com/api/appointment_profiles', token);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profiles.' });
  }
});

// router.get('/insurances', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access token is missing' });

//   const payerType = req.query.payer_type || 'emdeon'; // Default to "emdeon"

//   try {
//     const data = await fetchData(
//       'https://app.drchrono.com/api/insurances',
//       token,
//       { payer_type: payerType }
//     );
//     res.json(data.results); // Send only the results
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch insurances' });
//   }
// });


module.exports = router;
