// // backend/routes/denialReport.js
// const express = require('express');
// const axios = require('axios');
// const { Parser } = require('json2csv');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Utility to fetch data with dynamic token
// const fetchData = async (url, token) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching data from ${url}:`, error.message);
//     return null;
//   }
// };

// // Endpoint to generate the Denial Report
// router.get('/generate-denial-report', async (req, res) => {
//   const { since } = req.query; // Extract 'since' parameter from query
//   const token = req.headers.authorization?.split(' ')[1]; // Extract access token

//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid' });
//   }

//   try {
//     const transactionsResponse = await axios.get(
//       `https://app.drchrono.com/api/transactions?page_size=100&since=${since}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const transactions = transactionsResponse.data.results;

//     const detailedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         const doctor = transaction.doctor 
//           ? await fetchData(`https://app.drchrono.com/api/doctors/${transaction.doctor}`, token) 
//           : null;

//         const patient = transaction.patient 
//           ? await fetchData(`https://app.drchrono.com/api/patients/${transaction.patient}`, token) 
//           : null;

//         const appointment = transaction.appointment 
//           ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token) 
//           : {};

//         const lineItem = transaction.line_item 
//           ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token) 
//           : {};

//         return {
//           id: transaction.id,
//           adjustment_reason: transaction.adjustment_reason || null,
//           patient: patient ? `${patient.first_name} ${patient.last_name}` : null,
//           service_date: lineItem.service_date || null,
//           appointment_id: transaction.appointment || null,
//           doctor: doctor ? `${doctor.first_name} ${doctor.last_name}` : null,
//           supervising_provider: appointment.supervising_provider 
//             ? `${appointment.supervising_provider.first_name} ${appointment.supervising_provider.last_name}` 
//             : null,
//           billing_provider: appointment.billing_provider 
//             ? `${appointment.billing_provider.first_name} ${appointment.billing_provider.last_name}` 
//             : null,
//           office: appointment.office || null,
//           primary_insurance_name: appointment.primary_insurer_name || null,
//           primary_insurance_id: appointment.primary_insurance_id_number || null,
//           secondary_insurance_name: appointment.secondary_insurer_name || null,
//           secondary_insurance_id: appointment.secondary_insurance_id_number || null,
//           code: lineItem.code || null,
//           procedure_type: lineItem.procedure_type || null,
//         };
//       })
//     );

//     // Convert the detailed transactions into a CSV
//     const parser = new Parser();
//     const csv = parser.parse(detailedTransactions);

//     // Save the CSV file
//     const filePath = path.join(__dirname, 'denial_report.csv');
//     fs.writeFileSync(filePath, csv);

//     // Send the file as a response for download
//     res.download(filePath, 'denial_report.csv', (err) => {
//       if (err) {
//         console.error('Error sending the file:', err);
//         res.status(500).send('Failed to download Denial Report');
//       }
//     });
//   } catch (error) {
//     console.error('Error generating Denial Report:', error.message);
//     res.status(500).json({ message: 'Failed to generate Denial Report' });
//   }
// });

// module.exports = router;

// ---------------------------- Above Code is Backup ---------------------

// const express = require('express');
// const axios = require('axios'); // Axios for API calls
// const router = express.Router();

// // Helper function to fetch data from DrChrono API
// const fetchData = async (url, token, params = {}) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${url}:`, error.message);
//     throw error;
//   }
// };

// // Route to generate the Denial Report
// router.get('/generate-denial-report', async (req, res) => {
//   const {
//     start_date,
//     // end_date,
//     provider,
//     supervising_provider,
//     billing_provider,
//     office,
//     profile,
//     adjustment_code,
//   } = req.query;

//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });

//   // if (!start_date || !end_date) {
//   //   return res.status(400).json({ message: 'Start date and end date must be provided.' });
//   // }

//   try {
//     // Build query parameters for transactions
//     const params = {
//       since: start_date,
//       // until: end_date,
//       page_size: 100, // Limit results to the first 100 transactions
//     };

//     // Fetch transactions from DrChrono
//     const transactionsRes = await fetchData('https://app.drchrono.com/api/transactions', token, params);
//     const transactions = transactionsRes.results;

//     // Process and filter transactions based on the user-provided filters
//     const detailedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         const doctor = transaction.doctor
//           ? await fetchData(`https://app.drchrono.com/api/doctors/${transaction.doctor}`, token)
//           : {};
//         const patient = transaction.patient
//           ? await fetchData(`https://app.drchrono.com/api/patients/${transaction.patient}`, token)
//           : {};
//         const officeData = transaction.office
//           ? await fetchData(`https://app.drchrono.com/api/offices/${transaction.office}`, token)
//           : {};

//         // Apply filtering logic
//         const matchesProvider = provider ? transaction.doctor === provider : true;
//         const matchesSupervising = supervising_provider
//           ? transaction.supervising_provider === supervising_provider
//           : true;
//         const matchesBilling = billing_provider
//           ? transaction.billing_provider === billing_provider
//           : true;
//         const matchesOffice = office ? transaction.office === office : true;
//         const matchesProfile = profile ? transaction.profile === profile : true;
//         const matchesAdjustment = adjustment_code ? transaction.adjustment_reason === adjustment_code : true;

//         if (
//           !(
//             matchesProvider &&
//             matchesSupervising &&
//             matchesBilling &&
//             matchesOffice &&
//             matchesProfile &&
//             matchesAdjustment
//           )
//         ) {
//           return null; // Skip transactions that don't match all filters
//         }

//         return {
//           id: transaction.id,
//           adjustment_reason: transaction.adjustment_reason || 'N/A',
//           patient: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'N/A',
//           service_date: transaction.service_date || 'N/A',
//           doctor: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || 'N/A',
//           supervising_provider: transaction.supervising_provider || 'N/A',
//           billing_provider: transaction.billing_provider || 'N/A',
//           office: officeData.name || 'N/A',
//           primary_insurance_name: transaction.primary_insurer_name || 'N/A',
//           primary_insurance_id: transaction.primary_insurance_id_number || 'N/A',
//           secondary_insurance_name: transaction.secondary_insurer_name || 'N/A',
//           secondary_insurance_id: transaction.secondary_insurance_id_number || 'N/A',
//           code: transaction.code || 'N/A',
//           procedure_type: transaction.procedure_type || 'N/A',
//         };
//       })
//     );

//     // Filter out any null transactions
//     const finalReport = detailedTransactions.filter((tx) => tx !== null);

//     // Return the filtered report
//     res.json(finalReport);
//     console.log(json(finalReport));
//   } catch (error) {
//     console.error('Error generating Denial Report:', error.message);
//     res.status(500).json({ message: 'Failed to generate report.' });
//   }
// });

// module.exports = router;
// ------- Below code is for Patient name ----

// const express = require('express');
// const axios = require('axios');
// const {
//   getDoctorById,
//   getOfficeById,
//   getPatientById,
//   getProfileById,
// } = require('./dataCache'); // Import caching functions
// const router = express.Router();

// // Helper function to fetch data from API
// const fetchData = async (url, token, params = {}) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${url}:`, error.message);
//     throw error;
//   }
// };

// // Route to generate the Denial Report
// router.get('/generate-denial-report', async (req, res) => {
//   const {
//     start_date,
//     // provider,
//     // supervising_provider,
//     // billing_provider,
//     // office,
//     // // profile,
//     // adjustment_code,
//   } = req.query;

//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });

//   try {
//     // Build query parameters for transactions
//     const params = {
//       since: start_date,
//       page_size: 1000, // Limit results to the first 100 transactions
//     };

//     // Fetch transactions from DrChrono API
//     const transactionsRes = await fetchData('https://app.drchrono.com/api/transactions', token, params);
//     const transactions = transactionsRes.results;

//     // Process and filter transactions using caching functions
//     const detailedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         const doctor = transaction.doctor
//           ? await getDoctorById(transaction.doctor, token)
//           : {};
//         const officeData = transaction.office
//           ? await getOfficeById(transaction.office, token)
//           : {};
//         // const patient = transaction.patient
//         //   ? await getPatientById(transaction.patient, token)
//         //   : {};
//         // const appointmentProfile = transaction.profile
//         //   ? await getProfileById(transaction.profile, token)
//         //   : {};

//         // Apply filtering logic
//         const matchesProvider = provider ? transaction.doctor === provider : true;
//         const matchesSupervising = supervising_provider
//           ? transaction.supervising_provider === supervising_provider
//           : true;
//         const matchesBilling = billing_provider
//           ? transaction.billing_provider === billing_provider
//           : true;
//         const matchesOffice = office ? transaction.office === office : true;
//         const matchesProfile = profile ? transaction.profile === profile : true;
//         const matchesAdjustment = adjustment_code ? transaction.adjustment_reason === adjustment_code : true;

//         if (
//           !(
//             matchesProvider &&
//             matchesSupervising &&
//             matchesBilling &&
//             matchesOffice &&
//             matchesProfile &&
//             matchesAdjustment
//           )
//         ) {
//           return null; // Skip transactions that don't match all filters
//         }

//         return {
//           id: transaction.id,
//           adjustment_reason: transaction.adjustment_reason || 'N/A',
//           // patient: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'N/A',
//           patient_id: transaction.patient || 'N/A',
//           service_date: transaction.service_date || 'N/A',
//           doctor: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || 'N/A',
//           supervising_provider: transaction.supervising_provider || 'N/A',
//           billing_provider: transaction.billing_provider || 'N/A',
//           office: officeData.name || 'N/A',
//           primary_insurance_name: transaction.primary_insurer_name || 'N/A',
//           primary_insurance_id: transaction.primary_insurance_id_number || 'N/A',
//           secondary_insurance_name: transaction.secondary_insurer_name || 'N/A',
//           secondary_insurance_id: transaction.secondary_insurance_id_number || 'N/A',
//           code: transaction.code || 'N/A',
//           procedure_type: transaction.procedure_type || 'N/A',
//         };
//       })
//     );

//     // Filter out any null transactions
//     const finalReport = detailedTransactions.filter((tx) => tx !== null);

//     // Return the filtered report
//     res.json(finalReport);
//   } catch (error) {
//     console.error('Error generating Denial Report:', error.message);
//     res.status(500).json({ message: 'Failed to generate report.' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const axios = require('axios');
// const {
//   getDoctorById,
//   getOfficeById,
//   getPatientById,
//   getProfileById,
// } = require('./dataCache.js'); // Import caching functions
// const router = express.Router();

// // Helper function to fetch data from API
// const fetchData = async (url, token, params = {}) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${url}:`, error.message);
//     throw error; // Rethrow to handle it in the route
//   }
// };

// // Route to generate the Denial Report
// router.get('/generate-denial-report', async (req, res) => {
//   const { start_date } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   try {
//     const params = { since: start_date, page_size: 1000 };
//     const transactionsRes = await fetchData('https://app.drchrono.com/api/transactions', token, params);
//     const transactions = transactionsRes.results;

//     // Process and filter transactions using caching functions
//     const detailedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         try {
//           const doctor = transaction.doctor
//             ? await getDoctorById(transaction.doctor, token)
//             : {};

//           const appointment = transaction.appointment
//             ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
//             : {};

//           const lineItem = transaction.line_item
//             ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
//             : {};

//           const officeData = appointment.office
//             ? await getOfficeById(appointment.office, token)
//             : {};

//           const supervisingProvider = appointment.supervising_provider
//             ? await getDoctorById(appointment.supervising_provider, token)
//             : { first_name: '', last_name: '' };

//           const billingProdvider = appointment.billing_provider
//             ? await getDoctorById(appointment.billing_provider, token)
//             : { first_name: '', last_name: '' };

//           return {
//             id: transaction.id,
//             adjustment_reason: transaction.adjustment_reason || 'N/A',
//             appointment_id: transaction.appointment || null,
//             patient_id: lineItem.patient || 'N/A',
//             posted_date: lineItem.updated_at || 'N/A',
//             doctor: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || 'N/A',
//             supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//             billing_provider: `${billingProdvider.first_name} ${billingProdvider.last_name}`.trim(),
//             office: officeData.name || 'N/A',
//             primary_insurance_name: appointment.primary_insurer_name || 'N/A',
//             primary_insurance_id: appointment.primary_insurance_id_number || 'N/A',
//             secondary_insurance_name: appointment.secondary_insurer_name || 'N/A',
//             secondary_insurance_id: appointment.secondary_insurance_id_number || 'N/A',
//             code: lineItem.code || 'N/A',
//             procedure_type: lineItem.procedure_type || 'N/A',
//           };
//         } catch (error) {
//           console.error('Error processing transaction:', error);
//           return null; // Skip this transaction if an error occurs
//         }
//       })
//     );

//     const finalReport = detailedTransactions.filter((tx) => tx !== null);

//     // Send the final report
//     console.log('Processed data:', finalReport);
//     return res.json(finalReport);
//   } catch (error) {
//     console.error('Error generating Denial Report:', error.message);
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Failed to generate report.' });
//     }
//   }
// });

// module.exports = router;


// backend/routes/denialReport.js

// const express = require('express');
// const axios = require('axios');
// const {
//   getDoctorById,
//   getOfficeById,
//   getPatientById,
//   getProfileById,
// } = require('./dataCache.js'); // Import caching functions
// const router = express.Router();

// // Helper function to fetch a single page of data
// const fetchData = async (url, token, params = {}) => {
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

// // Route to generate the Denial Report with pagination
// router.get('/generate-denial-report', async (req, res) => {
//   const { start_date, next } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     console.error('Access token is missing or invalid.');
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   // Make start_date required only if nextUrl is not provided
//   if (!next && !start_date) {
//     console.error('Start date is missing.');
//     return res.status(400).json({ message: 'Start date must be provided unless using next URL.' });
//   }

//   try {
//     let apiUrl = 'https://app.drchrono.com/api/transactions';
//     let params = { page_size: 1000 };

//     if (next) {
//       // If nextUrl is provided, use it directly without additional params
//       apiUrl = decodeURIComponent(next); // Decode in case it's URL-encoded
//       params = {}; // Parameters are already included in the nextUrl
//       console.log(`Fetching next page using nextUrl: ${apiUrl}`);
//     } else {
//       // Initial fetch with since parameter
//       params.posted_date = start_date;
//       console.log(`Fetching initial page with since: ${params.posted_date}`);
//     }

//     // Fetch a single page of transactions
//     const transactionsRes = await fetchData(apiUrl, token, params);
//     if (!transactionsRes) {
//       console.error('Failed to fetch transactions.');
//       return res.status(500).json({ message: 'Failed to fetch transactions.' });
//     }

//     const { results, next: newNextUrl } = transactionsRes;

//     // Process and filter transactions using caching functions
//     const detailedTransactions = await Promise.all(
//       results.map(async (transaction) => {
//         try {
//           const doctor = transaction.doctor
//             ? await getDoctorById(transaction.doctor, token)
//             : {};

//           const appointment = transaction.appointment
//             ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
//             : {};

//           const lineItem = transaction.line_item
//             ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
//             : {};

//           const officeData = appointment.office
//             ? await getOfficeById(appointment.office, token)
//             : {};

//           const supervisingProvider = appointment.supervising_provider
//             ? await getDoctorById(appointment.supervising_provider, token)
//             : { first_name: '', last_name: '' };

//           const billingProvider = appointment.billing_provider
//             ? await getDoctorById(appointment.billing_provider, token)
//             : { first_name: '', last_name: '' };

//           const patient = appointment.patient
//             ? await getPatientById(appointment.patient, token)
//             : { first_name: 'Unknown', last_name: 'Patient' };

//           return {
//             id: transaction.id,
//             adjustment_reason: transaction.adjustment_reason || ' ',
//             appointment_id: transaction.appointment || null,
//             patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
//             posted_date: lineItem.updated_at || ' ',
//             doctor: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || ' ',
//             supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//             billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
//             office: officeData.name || ' ',
//             primary_insurance_name: appointment.primary_insurer_name || ' ',
//             primary_insurance_id: appointment.primary_insurance_id_number || ' ',
//             secondary_insurance_name: appointment.secondary_insurer_name || ' ',
//             secondary_insurance_id: appointment.secondary_insurance_id_number || ' ',
//             code: lineItem.code || ' ',
//             procedure_type: lineItem.procedure_type || ' ',
//           };
//         } catch (error) {
//           console.error('Error processing transaction:', error);
//           return null; // Skip this transaction if an error occurs
//         }
//       })
//     );

//     const finalReport = detailedTransactions.filter((tx) => tx !== null);

//     // Determine if there is a next page
//     const hasNextPage = newNextUrl ? true : false;

//     // Send the response
//     console.log(`Processed Denial Report - Current Page Count: ${finalReport.length}`);
//     res.json({
//       data: finalReport,
//       nextUrl: newNextUrl,
//       hasNextPage,
//     });
//   } catch (error) {
//     console.error('Error generating Denial Report:', error.message);
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Failed to generate report.' });
//     }
//   }
// });

// module.exports = router;

// Above Code works fantastic -------

const express = require('express');
const axios = require('axios');
const {
  getDoctorById,
  getOfficeById,
  getPatientById,
  getProfileById,
} = require('./dataCache.js'); // Import caching functions
const router = express.Router();

// Helper function to fetch a single page of data
const fetchData = async (url, token, params = {}) => {
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

// Route to generate the Denial Report with pagination
router.get('/generate-denial-report', async (req, res) => {
  const {
    start_date,
    next,
    doctor,
    supervising_provider,
    billing_provider,
    office,
    profile,
    adjustment_code,
  } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('Access token is missing or invalid.');
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  // Validate required parameters
  if (!next && !start_date) {
    console.error('Start date is missing.');
    return res.status(400).json({ message: 'Start date must be provided unless using next URL.' });
  }

  if (!next && doctor && !start_date) {
    console.error('Start date is required when doctor is specified.');
    return res.status(400).json({ message: 'Start date is required when doctor is specified.' });
  }

  try {
    let apiUrl = 'https://app.drchrono.com/api/transactions';
    let params = { page_size: 100 };

    if (next) {
      // If nextUrl is provided, use it directly without additional params
      apiUrl = decodeURIComponent(next); // Decode in case it's URL-encoded
      params = {}; // Parameters are already included in the nextUrl
      console.log(`Fetching next page using nextUrl: ${apiUrl}`);
    } else {
      // Initial fetch with posted_date and doctor if available
      params.posted_date = start_date;
      console.log(`Fetching initial page with posted_date: ${params.posted_date}`);

      if (doctor) {
        params.doctor = doctor;
        console.log(`Filtering transactions by doctor: ${doctor}`);
      }
    }

    // Fetch a single page of transactions
    const transactionsRes = await fetchData(apiUrl, token, params);
    if (!transactionsRes) {
      console.error('Failed to fetch transactions.');
      return res.status(500).json({ message: 'Failed to fetch transactions.' });
    }

    const { results, next: newNextUrl } = transactionsRes;

    // Process and filter transactions using caching functions
    const detailedTransactions = await Promise.all(
      results.map(async (transaction) => {
        try {
          const doctor = transaction.doctor
            ? await getDoctorById(transaction.doctor, token)
            : {};

          const appointment = transaction.appointment
            ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
            : {};

          const lineItem = transaction.line_item
            ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
            : {};

          const officeData = appointment.office
            ? await getOfficeById(appointment.office, token)
            : {};

          const supervisingProvider = appointment.supervising_provider
            ? await getDoctorById(appointment.supervising_provider, token)
            : { first_name: '', last_name: '' };

          const billingProvider = appointment.billing_provider
            ? await getDoctorById(appointment.billing_provider, token)
            : { first_name: '', last_name: '' };

          const patient = appointment.patient
            ? await getPatientById(appointment.patient, token)
            : { first_name: ' ', last_name: ' ' };

          const profile = appointment.profile
            ? await getProfileById(appointment.profile, token)
            : { name: '', id: null };

          return {
            id: transaction.id,
            adjustment_reason: transaction.adjustment_reason || ' ',
            appointment_id: transaction.appointment || null,
            patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
            patient_id: appointment.patient,
            posted_date: lineItem.updated_at || ' ',
            doctor: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || ' ',
            doctor_id: transaction.doctor,
            supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
            supervising_provider_id: appointment.supervising_provider,
            billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
            billing_provider_id: appointment.billing_provider,
            office: officeData.name || ' ',
            office_id: appointment.office,
            primary_insurance_name: appointment.primary_insurer_name || ' ',
            primary_insurance_id: appointment.primary_insurance_id_number || ' ',
            secondary_insurance_name: appointment.secondary_insurer_name || ' ',
            secondary_insurance_id: appointment.secondary_insurance_id_number || ' ',
            code: lineItem.code || ' ',
            procedure_type: lineItem.procedure_type || ' ',
            profile_id: appointment.profile,
          };
        } catch (error) {
          console.error('Error processing transaction:', error);
          return null; // Skip this transaction if an error occurs
        }
      })
    );

    // Apply additional filters
    const finalReport = detailedTransactions.filter((tx) => {
      if (tx === null) return false; // Exclude null entries

      let match = true;

      if (supervising_provider) {
        match = match && tx.supervising_provider_id === parseInt(supervising_provider);
      }
      if (billing_provider) {
        match = match && tx.billing_provider_id === parseInt(billing_provider);
      }
      if (office) {
        match = match && tx.office_id === parseInt(office);
      }
      if (profile) {
        match = match && tx.profile_id === parseInt(profile);
      }
      if (adjustment_code) {
        match = match && tx.adjustment_reason_code === adjustment_code;
      }

      return match;
    });

    // Determine if there is a next page
    const hasNextPage = newNextUrl ? true : false;

    // Send the response
    console.log(`Processed Denial Report - Current Page Count: ${finalReport.length}`);
    res.json({
      data: finalReport,
      nextUrl: newNextUrl,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error generating Denial Report:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate report.' });
    }
  }
});

module.exports = router;
