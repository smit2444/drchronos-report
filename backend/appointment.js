// const express = require('express');
// const axios = require('axios');
// const { Parser } = require('json2csv');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Fetch all doctors to map their names
// const fetchAllDoctors = async (access_token) => {
//   try {
//     const response = await axios.get('https://app.drchrono.com/api/doctors', {
//       headers: { Authorization: `Bearer ${access_token}` }
//     });
//     const doctors = response.data.results;
//     return doctors.reduce((map, doctor) => {
//       map[doctor.id] = `${doctor.first_name} ${doctor.last_name}`;
//       return map;
//     }, {});
//   } catch (error) {
//     console.error('Error fetching doctors:', error.message);
//     return {};
//   }
// };

// // Fetch doctor name by ID
// const fetchDoctorName = async (doctorId, access_token) => {
//   try {
//     const response = await axios.get(`https://app.drchrono.com/api/doctors/${doctorId}`, {
//       headers: { Authorization: `Bearer ${access_token}` }
//     });
//     return `${response.data.first_name} ${response.data.last_name}`;
//   } catch (error) {
//     console.error(`Error fetching doctor with ID ${doctorId}:`, error.message);
//     return null;
//   }
// };

// // Fetch office address by ID
// const fetchOfficeAddress = async (officeId, access_token) => {
//   try {
//     const response = await axios.get(`https://app.drchrono.com/api/offices/${officeId}`, {
//       headers: { Authorization: `Bearer ${access_token}` }
//     });
//     return response.data.address;
//   } catch (error) {
//     console.error(`Error fetching office with ID ${officeId}:`, error.message);
//     return null;
//   }
// };

// // Fetch patient name by ID
// const fetchPatientName = async (patientId, access_token) => {
//   try {
//     const response = await axios.get(`https://app.drchrono.com/api/patients/${patientId}`, {
//       headers: { Authorization: `Bearer ${access_token}` }
//     });
//     return `${response.data.first_name} ${response.data.last_name}`;
//   } catch (error) {
//     console.error(`Error fetching patient with ID ${patientId}:`, error.message);
//     return null;
//   }
// };

// // Fetch profile name by ID
// const fetchProfileName = async (profileId, access_token) => {
//   try {
//     const response = await axios.get(`https://app.drchrono.com/api/appointment_profiles/${profileId}`, {
//       headers: { Authorization: `Bearer ${access_token}` }
//     });
//     return response.data.name;
//   } catch (error) {
//     console.error(`Error fetching profile with ID ${profileId}:`, error.message);
//     return null;
//   }
// };

// // Endpoint for generating appointment report
// router.get('/generate-appointments-report', async (req, res) => {
//   const { since } = req.query;  // Extract only 'since' from query parameters
//   const access_token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

//   if (!access_token) {
//     return res.status(401).json({ message: 'Access token missing or invalid' });
//   }

//   try {
//     // Fetch appointments from the API using only the 'since' parameter
//     const [appointmentsResponse, doctorsMap] = await Promise.all([
//       axios.get(`https://app.drchrono.com/api/appointments?since=${since}&page_size=10`, {
//         headers: { Authorization: `Bearer ${access_token}` }
//       }),
//       fetchAllDoctors(access_token)
//     ]);

//     const appointments = appointmentsResponse.data.results;

//     const detailedAppointments = await Promise.all(
//       appointments.map(async (appointment) => {
//         const doctorName = appointment.doctor ? await fetchDoctorName(appointment.doctor, access_token) : null;
//         const supervisingProviderName = appointment.supervising_provider ? await fetchDoctorName(appointment.supervising_provider, access_token) : null;
//         const billingProviderName = appointment.billing_provider ? await fetchDoctorName(appointment.billing_provider, access_token) : null;
//         const officeAddress = appointment.office ? await fetchOfficeAddress(appointment.office, access_token) : null;
//         const patientName = appointment.patient ? await fetchPatientName(appointment.patient, access_token) : null;
//         const profileName = appointment.profile ? await fetchProfileName(appointment.profile, access_token) : null;

//         return {
//           appointment_id: appointment.id,
//           scheduled_time: appointment.scheduled_time || null,
//           doctor: doctorName,
//           supervising_provider: supervisingProviderName,
//           billing_provider: billingProviderName,
//           office: officeAddress,
//           profile: profileName,
//           patient: patientName,
//           duration: appointment.duration || null,
//           primary_insurer_name: appointment.primary_insurer_name || null,
//           primary_insurance_id_number: appointment.primary_insurance_id_number || null,
//           secondary_insurer_name: appointment.secondary_insurer_name || null,
//           secondary_insurance_id_number: appointment.secondary_insurance_id_number || null,
//         };
//       })
//     );

//     const json2csvParser = new Parser();
//     const csv = json2csvParser.parse(detailedAppointments);

//     const filePath = path.join(__dirname, 'appointments.csv');
//     fs.writeFileSync(filePath, csv);

//     // Send the CSV file as a response
//     res.download(filePath, 'appointments_report.csv', (err) => {
//       if (err) {
//         console.error('Error sending CSV file:', err);
//         res.status(500).send('Failed to download CSV');
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching appointments:', error.response ? error.response.data : error.message);
//     res.status(500).json({ message: 'Failed to generate report' });
//   }
// });

// module.exports = router;
//----------------------------- New Code Below --------------------------------------------------

// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// // Helper function to fetch data with query parameters
// const fetchData = async (url, token, params = {}) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${url}:`, error.response?.data || error.message);
//     throw error;
//   }
// };

// const cache = { patients: {}, doctors: {}, offices: {}, profiles: {} };

// // Function to fetch patient by ID and cache it
// const fetchPatientName = async (patientId, token) => {
//   if (!patientId) {
//     console.warn('Patient ID is missing or invalid.');
//     return 'Unknown';  // Handle null or undefined patient IDs
//   }

//   // Return cached patient name if available
//   if (cache.patients[patientId]) {
//     console.log(`Returning cached patient name for ID: ${patientId}`);
//     return cache.patients[patientId];
//   }

//   try {
//     // Fetch patient details from DrChrono API
//     const response = await axios.get(`https://app.drchrono.com/api/patients/${patientId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     console.log(`Fetched patient data for ID ${patientId}:`, response.data);

//     // Extract first and last names or fallback to 'Unknown'
//     const firstName = response.data.first_name || '';
//     const lastName = response.data.last_name || '';
//     const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';

//     // Cache the result for future use
//     cache.patients[patientId] = fullName;
//     return fullName;
//   } catch (error) {
//     console.error(`Error fetching patient with ID ${patientId}:`, error.message);
//     return 'Unknown';  // Handle errors gracefully
//   }
// };

// // Batch-fetch doctors, offices, and profiles
// const loadData = async (token) => {
//   const [doctors, offices, profiles] = await Promise.all([
//     fetchData('https://app.drchrono.com/api/doctors', token),
//     fetchData('https://app.drchrono.com/api/offices', token),
//     fetchData('https://app.drchrono.com/api/appointment_profiles', token),
//   ]);

//   // Convert results to ID-mapped objects for fast lookup
//   cache.doctors = Object.fromEntries(
//     doctors.results.map((doc) => [doc.id, `${doc.first_name} ${doc.last_name}`])
//   );
//   cache.offices = Object.fromEntries(offices.results.map((office) => [office.id, office.name]));
//   cache.profiles = Object.fromEntries(profiles.results.map((profile) => [profile.id, profile.name]));
// };

// // Route to fetch and generate human-readable appointment data
// router.get('/appointments', async (req, res) => {
//   const { start_date, end_date, doctor } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

//   if (!start_date || !end_date) {
//     return res.status(400).json({ message: 'Start date and end date must be provided.' });
//   }

//   try {
//     // Load doctors, offices, and profiles data
//     await loadData(token);

//     // Fetch appointments within the date range
//     const params = { date_range: `${start_date}/${end_date}`, doctor, page_size: 100 };
//     const appointmentsRes = await fetchData('https://app.drchrono.com/api/appointments', token, params);

//     // Process appointments and fetch patient names individually
//     const appointments = await Promise.all(
//       appointmentsRes.results.map(async (appointment) => {
//         const patientName = appointment.patient
//           ? await fetchPatientName(appointment.patient, token)  // Fetch only if valid patient ID
//           : '';  // Handle missing patient IDs gracefully

//         return {
//           appointment_id: appointment.id,
//           scheduled_time: appointment.scheduled_time || '',
//           doctor: cache.doctors[appointment.doctor] || '',
//           supervising_provider: cache.doctors[appointment.supervising_provider] || '',
//           billing_provider: cache.doctors[appointment.billing_provider] || '',
//           office: cache.offices[appointment.office] || '',
//           patient_name: patientName || '',
//           profile: cache.profiles[appointment.profile] || '',
//           duration: appointment.duration || '',
//           primary_insurer_name: appointment.primary_insurer_name || '',
//           primary_insurance_id_number: appointment.primary_insurance_id_number || '',
//           secondary_insurer_name: appointment.secondary_insurer_name || '',
//           secondary_insurance_id_number: appointment.secondary_insurance_id_number || '',
//         };
//       })
//     );
//     console.log('data: ',appointments)
//     res.json(appointments);
//   } catch (error) {
//     console.error('Failed to fetch appointments:', error);
//     res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
//   }
// });

// module.exports = router;

// --------------------------

// const express = require('express');
// const axios = require('axios');
// const { getDoctorById, getOfficeById, getPatientById, dataCache } = require('./dataCache.js'); // Import from dataCache.js
// const router = express.Router();

// // Helper function to fetch data with query parameters
// // const fetchData = async (url, token, params = {}) => {
// //   try {
// //     let allResults = []; // Accumulate results from all pages
// //     let nextUrl = url;

// //     while (nextUrl) {
// //       const response = await axios.get(nextUrl, {
// //         headers: { Authorization: `Bearer ${token}` },
// //         params, // Use params only for the first request
// //       });

// //       const data = response.data;
// //       allResults = allResults.concat(data.results); // Accumulate results
// //       nextUrl = data.next; // Get the next page URL (if any)
// //       params = {}; // Clear params to avoid issues in subsequent requests
// //     }

// //     return allResults; // Return all accumulated results
// //   } catch (error) {
// //     console.error(`Error fetching data from ${url}:`, error.response?.data || error.message);
// //     throw error;
// //   }
// // };

// const fetchData = async (url, token, params = {}) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${url}:`, error.response?.data || error.message);
//     throw error;
//   }
// };

// // Load initial doctors, offices, and profiles data
// const loadData = async (token) => {
//   if (
//     Object.keys(dataCache.doctors).length === 0 ||
//     Object.keys(dataCache.offices).length === 0 ||
//     Object.keys(dataCache.profiles).length === 0
//   ) {
//     console.log('Fetching bulk data from API...');
//     const [doctorsData, officesData, profilesData] = await Promise.all([
//       fetchData('https://app.drchrono.com/api/doctors', token),
//       fetchData('https://app.drchrono.com/api/offices', token),
//       fetchData('https://app.drchrono.com/api/appointment_profiles', token),
//     ]);

//     // Cache necessary data
//     dataCache.doctors = Object.fromEntries(
//       doctorsData.results.map((doc) => [
//         doc.id,
//         { first_name: doc.first_name, last_name: doc.last_name },
//       ])
//     );
//     dataCache.offices = Object.fromEntries(
//       officesData.results.map((office) => [office.id, { name: office.name }])
//     );
//     dataCache.profiles = Object.fromEntries(
//       profilesData.results.map((profile) => [profile.id, { name: profile.name }])
//     );
//   } else {
//     console.log('Using cached data for doctors, offices, and profiles.');
//   }
// };

// router.get('/appointments', async (req, res) => {
//   const { start_date, end_date } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

//   if (!start_date || !end_date) {
//     return res.status(400).json({ message: 'Start date and end date must be provided.' });
//   }

//   try {
//     // Load initial data if not already cached
//     await loadData(token);

//     // Fetch appointments within the date range
//     // const params = { date_range: `${start_date}/${end_date}`, doctor, page_size: 100 };
//     const params = { date_range: `${start_date}/${end_date}`, page_size: 1000 };
//     const appointmentsRes = await fetchData('https://app.drchrono.com/api/appointments', token, params);
//     // const allAppointments = await fetchData('https://app.drchrono.com/api/appointments', token, params);


//     // Process each appointment
//     const appointments = await Promise.all(
//       appointmentsRes.results.map(async (appointment) => {
//         // const patientName = appointment.patient
//         //   ? await fetchData(`https://app.drchrono.com/api/patients/${appointment.patient}`, token)
//         //   : '';

//         const doctor = appointment.doctor
//           ? await getDoctorById(appointment.doctor, token)
//           : { first_name: '', last_name: '' };
//         const supervisingProvider = appointment.supervising_provider
//           ? await getDoctorById(appointment.supervising_provider, token)
//           : { first_name: '', last_name: '' };

//         const office = appointment.office
//           ? await getOfficeById(appointment.office, token)
//           : { name: '' };

//         // const patient = appointment.patient
//         //   ? await getPatientById(appointment.patient, token)
//         //   : { first_name: 'Unknown', last_name: 'Patient' };

//         return {
//           appointment_id: appointment.id,
//           scheduled_time: appointment.scheduled_time || '',
//           doctorName: `${doctor.first_name} ${doctor.last_name}`.trim(),
//           supervisingProvider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//           officeName: office.name,
//           // patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
//           patient_id: appointment.patient,
//           profile: dataCache.profiles[appointment.profile]?.name || '',
//           duration: appointment.duration || '',
//           primary_insurer_name: appointment.primary_insurer_name || '',
//           primary_insurance_id_number: appointment.primary_insurance_id_number || '',
//           secondary_insurer_name: appointment.secondary_insurer_name || '',
//           secondary_insurance_id_number: appointment.secondary_insurance_id_number || '',
//         };
//       })
//     );

//     console.log('Processed Appointments:', appointments);
//     res.json(appointments);
//   } catch (error) {
//     console.error('Failed to fetch appointments:', error);
//     res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
//   }
// });
// // router.get('/appointments', async (req, res) => {
// //   const { start_date, end_date, doctor } = req.query;
// //   const token = req.headers.authorization?.split(' ')[1];

// //   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

// //   if (!start_date || !end_date) {
// //     return res.status(400).json({ message: 'Start date and end date must be provided.' });
// //   }

// //   try {
// //     // Load initial data if not already cached
// //     await loadData(token);

// //     const params = { date_range: `${start_date}/${end_date}`, doctor, page_size: 100 };
    
// //     // Fetch all pages of appointments (handle pagination)
// //     const allAppointments = [];
// //     let nextUrl = 'https://app.drchrono.com/api/appointments';

// //     while (nextUrl) {
// //       const response = await fetchData(nextUrl, token, params);
// //       allAppointments.push(...response.results); // Accumulate results from all pages
// //       nextUrl = response.next; // Update the next page URL
// //       params = {}; // Clear params after the first call
// //     }

// //     // Process each appointment
// //     const appointments = await Promise.all(
// //       allAppointments.map(async (appointment) => {
// //         const doctor = appointment.doctor
// //           ? await getDoctorById(appointment.doctor, token)
// //           : { first_name: '', last_name: '' };

// //         const supervisingProvider = appointment.supervising_provider
// //           ? await getDoctorById(appointment.supervising_provider, token)
// //           : { first_name: '', last_name: '' };

// //         const office = appointment.office
// //           ? await getOfficeById(appointment.office, token)
// //           : { name: '' };

// //         const patient = appointment.patient
// //           ? await getPatientById(appointment.patient, token)
// //           : { first_name: 'Unknown', last_name: 'Patient' };

// //         return {
// //           appointment_id: appointment.id,
// //           scheduled_time: appointment.scheduled_time || '',
// //           doctorName: `${doctor.first_name} ${doctor.last_name}`.trim(),
// //           supervisingProvider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
// //           officeName: office.name,
// //           patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
// //           profile: dataCache.profiles[appointment.profile]?.name || '',
// //           duration: appointment.duration || '',
// //           primary_insurer_name: appointment.primary_insurer_name || '',
// //           primary_insurance_id_number: appointment.primary_insurance_id_number || '',
// //           secondary_insurer_name: appointment.secondary_insurer_name || '',
// //           secondary_insurance_id_number: appointment.secondary_insurance_id_number || '',
// //         };
// //       })
// //     );

// //     console.log('Processed Appointments:', appointments);
// //     res.json(appointments);
// //   } catch (error) {
// //     console.error('Failed to fetch appointments:', error);
// //     res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
// //   }
// // });

// module.exports = router;


// --------- New code here for test: 

// const express = require('express');
// const axios = require('axios');
// const { getDoctorById, getOfficeById, getPatientById, dataCache } = require('./dataCache.js');
// const router = express.Router();

// // Helper function to fetch data with pagination
// const fetchData = async (url, token, params = {}) => {
//   try {
//     let allResults = []; // Accumulate results from all pages
//     let nextUrl = url;

//     while (nextUrl) {
//       const response = await axios.get(nextUrl, {
//         headers: { Authorization: `Bearer ${token}` },
//         params, // Use params only for the first request
//       });

//       const data = response.data;
//       allResults.push(...data.results); // Accumulate results
//       nextUrl = data.next; // Get the next page URL (if any)
//       params = {}; // Clear params for subsequent requests
//     }

//     return allResults; // Return all accumulated results
//   } catch (error) {
//     console.error(`Error fetching data from ${url}:`, error.response?.data || error.message);
//     throw error;
//   }
// };

// // Load initial doctors, offices, and profiles data
// const loadData = async (token) => {
//   if (
//     Object.keys(dataCache.doctors).length === 0 ||
//     Object.keys(dataCache.offices).length === 0 ||
//     Object.keys(dataCache.profiles).length === 0
//   ) {
//     console.log('Fetching bulk data from API...');
//     const [doctorsData, officesData, profilesData] = await Promise.all([
//       fetchData('https://app.drchrono.com/api/doctors', token),
//       fetchData('https://app.drchrono.com/api/offices', token),
//       fetchData('https://app.drchrono.com/api/appointment_profiles', token),
//     ]);

//     dataCache.doctors = Object.fromEntries(
//       doctorsData.map((doc) => [doc.id, { first_name: doc.first_name, last_name: doc.last_name }])
//     );
//     dataCache.offices = Object.fromEntries(
//       officesData.map((office) => [office.id, { name: office.name }])
//     );
//     dataCache.profiles = Object.fromEntries(
//       profilesData.map((profile) => [profile.id, { name: profile.name }])
//     );
//   } else {
//     console.log('Using cached data for doctors, offices, and profiles.');
//   }
// };

// // Route to fetch and process appointments
// router.get('/appointments', async (req, res) => {
//   const { start_date, end_date } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

//   if (!start_date || !end_date) {
//     return res.status(400).json({ message: 'Start date and end date must be provided.' });
//   }

//   try {
//     // Load cached data if not already loaded
//     await loadData(token);

//     const params = { date_range: `${start_date}/${end_date}`, page_size: 1000 };
//     const allAppointments = await fetchData('https://app.drchrono.com/api/appointments', token, params);

//     // Process each appointment
//     const appointments = await Promise.all(
//       allAppointments.map(async (appointment) => {
//         const doctor = appointment.doctor
//           ? await getDoctorById(appointment.doctor, token)
//           : { first_name: '', last_name: '' };

//         const supervisingProvider = appointment.supervising_provider
//           ? await getDoctorById(appointment.supervising_provider, token)
//           : { first_name: '', last_name: '' };

//         const office = appointment.office
//           ? await getOfficeById(appointment.office, token)
//           : { name: '' };

//         // const patient = appointment.patient
//         //   ? await getPatientById(appointment.patient, token)
//         //   : { first_name: 'Unknown', last_name: 'Patient' };

//         return {
//           appointment_id: appointment.id,
//           scheduled_time: appointment.scheduled_time || '',
//           doctorName: `${doctor.first_name} ${doctor.last_name}`.trim(),
//           supervisingProvider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//           officeName: office.name,
//           // patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
//           patient_id: appointment.patient,
//           profile: dataCache.profiles[appointment.profile]?.name || '',
//           duration: appointment.duration || '',
//           primary_insurer_name: appointment.primary_insurer_name || '',
//           primary_insurance_id_number: appointment.primary_insurance_id_number || '',
//           secondary_insurer_name: appointment.secondary_insurer_name || '',
//           secondary_insurance_id_number: appointment.secondary_insurance_id_number || '',
//         };
//       })
//     );

//     console.log('Processed Appointments:', appointments);
//     res.json(appointments);
//   } catch (error) {
//     console.error('Failed to fetch appointments:', error);
//     res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
//   }
// });

// module.exports = router;


// backend/routes/appointments.js
// below code fantastically ---------
// const express = require('express');
// const axios = require('axios');
// const { getDoctorById, getOfficeById, getPatientById, dataCache } = require('./dataCache.js');
// const router = express.Router();

// // Helper function to fetch a single page of data
// const fetchSinglePage = async (url, token, params = {}) => {
//   try {
//     console.log(`Fetching URL: ${url} with params:`, params);
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     console.log(`Successfully fetched data from: ${url}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${url}:`, error.response?.data || error.message);
//     throw error;
//   }
// };

// // Load initial doctors, offices, and profiles data
// const loadData = async (token) => {
//   if (
//     Object.keys(dataCache.doctors).length === 0 ||
//     Object.keys(dataCache.offices).length === 0 ||
//     Object.keys(dataCache.profiles).length === 0
//   ) {
//     console.log('Fetching bulk data from API...');
//     const [doctorsData, officesData, profilesData] = await Promise.all([
//       fetchSinglePage('https://app.drchrono.com/api/doctors', token),
//       fetchSinglePage('https://app.drchrono.com/api/offices', token),
//       fetchSinglePage('https://app.drchrono.com/api/appointment_profiles', token),
//     ]);

//     dataCache.doctors = Object.fromEntries(
//       doctorsData.results.map((doc) => [doc.id, { first_name: doc.first_name, last_name: doc.last_name }])
//     );
//     dataCache.offices = Object.fromEntries(
//       officesData.results.map((office) => [office.id, { name: office.name }])
//     );
//     dataCache.profiles = Object.fromEntries(
//       profilesData.results.map((profile) => [profile.id, { name: profile.name }])
//     );

//     console.log('Bulk data loaded and cached.');
//   } else {
//     console.log('Using cached data for doctors, offices, and profiles.');
//   }
// };

// // Route to fetch and process appointments with pagination
// router.get('/appointments', async (req, res) => {
//   const { start_date, end_date, next } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     console.error('Access token is missing or invalid.');
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   // Make start_date and end_date required only if nextUrl is not provided
//   if (!next && (!start_date || !end_date)) {
//     console.error('Start date and/or end date is missing.');
//     return res.status(400).json({ message: 'Start date and end date must be provided unless using next URL.' });
//   }

//   try {
//     // Load cached data if not already loaded
//     await loadData(token);

//     let apiUrl = 'https://app.drchrono.com/api/appointments';
//     let params = { page_size: 250 };

//     if (next) {
//       // If nextUrl is provided, use it directly without additional params
//       apiUrl = decodeURIComponent(next); // Decode in case it's URL-encoded
//       params = {}; // Parameters are already included in the nextUrl
//       console.log(`Fetching next page using nextUrl: ${apiUrl}`);
//     } else {
//       // Initial fetch with date_range
//       params.date_range = `${start_date}/${end_date}`;
//       console.log(`Fetching initial page with date_range: ${params.date_range}`);
//     }

//     // Fetch a single page of appointments
//     const response = await fetchSinglePage(apiUrl, token, params);

//     if (!response) {
//       console.error('Failed to fetch appointments.');
//       return res.status(500).json({ message: 'Failed to fetch appointments.' });
//     }

//     const { results, next: newNextUrl } = response;

//     // Process each appointment
//     const appointments = await Promise.all(
//       results.map(async (appointment) => {
//         const doctor = appointment.doctor
//           ? await getDoctorById(appointment.doctor, token)
//           : { first_name: '', last_name: '' };

//         const supervisingProvider = appointment.supervising_provider
//           ? await getDoctorById(appointment.supervising_provider, token)
//           : { first_name: '', last_name: '' };

//         const office = appointment.office
//           ? await getOfficeById(appointment.office, token)
//           : { name: '' };

//         const patient = appointment.patient
//           ? await getPatientById(appointment.patient, token)
//           : { first_name: 'Unknown', last_name: 'Patient' };

//         return {
//           appointment_id: appointment.id,
//           scheduled_time: appointment.scheduled_time || '',
//           doctorName: `${doctor.first_name} ${doctor.last_name}`.trim(),
//           supervisingProvider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//           officeName: office.name,
//           patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
//           patient_id: appointment.patient,
//           profile: dataCache.profiles[appointment.profile]?.name || '',
//           duration: appointment.duration || '',
//           primary_insurer_name: appointment.primary_insurer_name || '',
//           primary_insurance_id_number: appointment.primary_insurance_id_number || '',
//           secondary_insurer_name: appointment.secondary_insurer_name || '',
//           secondary_insurance_id_number: appointment.secondary_insurance_id_number || '',
//         };
//       })
//     );

//     // Determine if there is a next page
//     const hasNextPage = newNextUrl ? true : false;

//     console.log(`Processed Appointments - Current Page Count: ${appointments.length}`);
//     res.json({
//       data: appointments,
//       nextUrl: newNextUrl,
//       hasNextPage,
//     });
//   } catch (error) {
//     console.error('Failed to fetch appointments:', error);
//     res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const axios = require('axios');
const { getDoctorById, getOfficeById, getPatientById, dataCache } = require('./dataCache.js');
const router = express.Router();

// Helper function to fetch a single page of data
const fetchSinglePage = async (url, token, params = {}) => {
  try {
    console.log(`Fetching URL: ${url} with params:`, params);
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    console.log(`Successfully fetched data from: ${url}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// Load initial doctors, offices, and profiles data
const loadData = async (token) => {
  if (
    Object.keys(dataCache.doctors).length === 0 ||
    Object.keys(dataCache.offices).length === 0 ||
    Object.keys(dataCache.profiles).length === 0
  ) {
    console.log('Fetching bulk data from API...');
    const [doctorsData, officesData, profilesData] = await Promise.all([
      fetchSinglePage('https://app.drchrono.com/api/doctors', token),
      fetchSinglePage('https://app.drchrono.com/api/offices', token),
      fetchSinglePage('https://app.drchrono.com/api/appointment_profiles', token),
    ]);

    dataCache.doctors = Object.fromEntries(
      doctorsData.results.map((doc) => [doc.id, { first_name: doc.first_name, last_name: doc.last_name }])
    );
    dataCache.offices = Object.fromEntries(
      officesData.results.map((office) => [office.id, { name: office.name }])
    );
    dataCache.profiles = Object.fromEntries(
      profilesData.results.map((profile) => [profile.id, { name: profile.name }])
    );

    console.log('Bulk data loaded and cached.');
  } else {
    console.log('Using cached data for doctors, offices, and profiles.');
  }
};

// Route to fetch and process appointments with pagination
router.get('/appointments', async (req, res) => {
  const {
    start_date,
    end_date,
    next,
    doctor,
    supervising_provider,
    office,
    profile,
  } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('Access token is missing or invalid.');
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  // Make start_date and end_date required only if nextUrl is not provided
  if (!next && (!start_date || !end_date)) {
    console.error('Start date and/or end date is missing.');
    return res.status(400).json({ message: 'Start date and end date must be provided unless using next URL.' });
  }

  try {
    // Load cached data if not already loaded
    await loadData(token);

    let apiUrl = 'https://app.drchrono.com/api/appointments';
    let params = { page_size: 250 };

    if (next) {
      // If nextUrl is provided, use it directly without additional params
      apiUrl = decodeURIComponent(next); // Decode in case it's URL-encoded
      params = {}; // Parameters are already included in the nextUrl
      console.log(`Fetching next page using nextUrl: ${apiUrl}`);
    } else {
      // Initial fetch with date_range
      params.date_range = `${start_date}/${end_date}`;
      console.log(`Fetching initial page with date_range: ${params.date_range}`);

      if (doctor) {
        params.doctor = doctor;
        console.log(`Filtering appointments by doctor: ${doctor}`);
      }

      if (office) {
        params.office = office;
        console.log(`Filtering appointments by office: ${office}`);
      }
    }

    // Fetch a single page of appointments
    const response = await fetchSinglePage(apiUrl, token, params);

    if (!response) {
      console.error('Failed to fetch appointments.');
      return res.status(500).json({ message: 'Failed to fetch appointments.' });
    }

    const { results, next: newNextUrl } = response;

    // Process each appointment
    const appointments = await Promise.all(
      results.map(async (appointment) => {
        const doctor = appointment.doctor
          ? await getDoctorById(appointment.doctor, token)
          : { first_name: '', last_name: '' };

        const supervisingProvider = appointment.supervising_provider
          ? await getDoctorById(appointment.supervising_provider, token)
          : { first_name: '', last_name: '' };

        const office = appointment.office
          ? await getOfficeById(appointment.office, token)
          : { name: '' };

        const patient = appointment.patient
          ? await getPatientById(appointment.patient, token)
          : { first_name: ' ', last_name: ' ' };

        return {
          appointment_id: appointment.id,
          scheduled_time: appointment.scheduled_time || '',
          doctorName: `${doctor.first_name} ${doctor.last_name}`.trim(),
          doctor_id: appointment.doctor,
          supervisingProvider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
          supervising_provider_id: appointment.supervising_provider,
          officeName: office.name,
          office_id: appointment.office,
          patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
          patient_id: appointment.patient,
          profile: dataCache.profiles[appointment.profile]?.name || '',
          profile_id: appointment.profile,
          duration: appointment.duration || '',
          primary_insurer_name: appointment.primary_insurer_name || '',
          primary_insurance_id_number: appointment.primary_insurance_id_number || '',
          secondary_insurer_name: appointment.secondary_insurer_name || '',
          secondary_insurance_id_number: appointment.secondary_insurance_id_number || '',
        };
      })
    );

    // Apply additional filters
    const filteredAppointments = appointments.filter((appt) => {
      let match = true;

      if (supervising_provider) {
        match = match && appt.supervising_provider_id === parseInt(supervising_provider);
      }
      if (profile) {
        match = match && appt.profile_id === parseInt(profile);
      }

      return match;
    });

    // Determine if there is a next page
    const hasNextPage = newNextUrl ? true : false;

    console.log(`Processed Appointments - Current Page Count: ${filteredAppointments.length}`);
    res.json({
      data: filteredAppointments,
      nextUrl: newNextUrl,
      hasNextPage,
    });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

module.exports = router;
