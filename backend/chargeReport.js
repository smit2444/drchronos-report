// // backend/routes/chargeReport.js
// const express = require('express');
// const axios = require('axios');
// const { Parser } = require('json2csv');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Utility to fetch data with a token
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

// // Remove duplicate transactions
// const removeDuplicates = (transactions) => {
//   const seen = new Set();
//   return transactions.filter((transaction) => {
//     const uniqueId = `${transaction.appointment}-${transaction.line_item}`;
//     if (!seen.has(uniqueId)) {
//       seen.add(uniqueId);
//       return true;
//     }
//     return false;
//   });
// };

// // Endpoint to generate Charge Report
// router.get('/generate-charge-report', async (req, res) => {
//   const { since } = req.query; // Extract 'since' from query params
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid' });
//   }

//   try {
//     const response = await axios.get(
//       `https://app.drchrono.com/api/transactions?page_size=100&since=${since}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     let transactions = response.data.results;
//     transactions = removeDuplicates(transactions); // Remove duplicate transactions

//     const detailedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         const doctorName = transaction.doctor
//           ? await fetchData(`https://app.drchrono.com/api/doctors/${transaction.doctor}`, token)
//           : null;

//         const patientName = transaction.patient
//           ? await fetchData(`https://app.drchrono.com/api/patients/${transaction.patient}`, token)
//           : null;

//         const appointmentDetails = transaction.appointment
//           ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
//           : {};

//         const lineItemDetails = transaction.line_item
//           ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
//           : {};

//         return {
//           service_date: lineItemDetails.service_date || null,
//           last_billed_date: appointmentDetails.last_billed_date || null,
//           updated_at: lineItemDetails.updated_at || null,
//           posted_date: lineItemDetails.posted_date || null,
//           total_billed: lineItemDetails.billed_amount || null,
//           provider: doctorName || null,
//           supervising_provider: appointmentDetails.supervising_provider || null,
//           billing_provider: appointmentDetails.billing_provider || null,
//           office: appointmentDetails.office || null,
//           primary_insurance_id: appointmentDetails.primary_insurance_id_number || null,
//           primary_insurance_name: appointmentDetails.primary_insurer_name || null,
//           secondary_insurance_id: appointmentDetails.secondary_insurance_id_number || null,
//           secondary_insurance_name: appointmentDetails.secondary_insurer_name || null,
//           patient: patientName || null,
//           appointment_profile: appointmentDetails.profile || null,
//           appointment_id: transaction.appointment || null,
//           code: lineItemDetails.code || null,
//           procedure_type: lineItemDetails.procedure_type || null,
//         };
//       })
//     );

//     const fields = [
//       'service_date',
//       'last_billed_date',
//       'updated_at',
//       'posted_date',
//       'total_billed',
//       'provider',
//       'supervising_provider',
//       'billing_provider',
//       'office',
//       'primary_insurance_id',
//       'primary_insurance_name',
//       'secondary_insurance_id',
//       'secondary_insurance_name',
//       'patient',
//       'appointment_profile',
//       'appointment_id',
//       'code',
//       'procedure_type',
//     ];

//     const parser = new Parser({ fields });
//     const csv = parser.parse(detailedTransactions);

//     const filePath = path.join(__dirname, 'charge_report.csv');
//     fs.writeFileSync(filePath, csv);



//     res.download(filePath, 'charge_report.csv', (err) => {
//       if (err) {
//         console.error('Error sending the file:', err);
//         res.status(500).send('Failed to download Charge Report');
//       }
//     });
//   } catch (error) {
//     console.error('Error generating Charge Report:', error.message);
//     res.status(500).json({ message: 'Failed to generate Charge Report' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const axios = require('axios');
// const { getDoctorById, getPatientById, getOfficeById, dataCache } = require('./dataCache.js'); // Import shared caching
// const router = express.Router();

// // Function to fetch list data (e.g., transactions) with optional pagination
// const fetchListData = async (url, token, params = {}) => {
//   let allResults = [];
//   let nextUrl = url;
//   const maxIterations = 10; // To prevent infinite loops in pagination
//   let iterationCount = 0;

//   try {
//     while (nextUrl && iterationCount < maxIterations) {
//       const response = await axios.get(nextUrl, {
//         headers: { Authorization: `Bearer ${token}` },
//         params, // Use params only for the first request
//       });

//       const { results, next } = response.data;

//       if (Array.isArray(results)) {
//         allResults.push(...results); // Accumulate results
//       } else {
//         console.error(`Unexpected response format from ${nextUrl}:`, response.data);
//         break; // Exit the loop if the expected structure isn't met
//       }

//       nextUrl = next; // Continue to next page if available
//       params = {}; // Clear params for subsequent requests
//       iterationCount++;
//     }

//     return allResults;
//   } catch (error) {
//     console.error(`Error fetching list data from ${url}:`, error.message);
//     throw error;
//   }
// };

// // Function to fetch single resource data (e.g., appointment, line_item)
// const fetchSingleData = async (url, token) => {
//   try {
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     return response.data; // Return the single resource object
//   } catch (error) {
//     console.error(`Error fetching single data from ${url}:`, error.message);
//     throw error;
//   }
// };

// // Remove duplicate transactions based on appointment and line_item
// const removeDuplicates = (transactions) => {
//   const seen = new Set();
//   return transactions.filter((transaction) => {
//     const uniqueId = `${transaction.appointment}-${transaction.line_item}`;
//     if (!seen.has(uniqueId)) {
//       seen.add(uniqueId);
//       return true;
//     }
//     return false;
//   });
// };

// // Route to generate the Charge Report
// router.get('/generate-charge-report', async (req, res) => {
//   const { start_date, end_date } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   if (!start_date || !end_date) {
//     return res.status(400).json({ message: 'Start date and end date must be provided.' });
//   }

//   try {
//     // Build dynamic query parameters
//     const params = { date_range: `${start_date}/${end_date}`, page_size: 100 };

//     console.log('Fetching transactions with params:', params);

//     // Fetch all transactions with pagination
//     const transactions = await fetchListData('https://app.drchrono.com/api/transactions', token, params);

//     if (!Array.isArray(transactions)) {
//       console.error('Fetched transactions is not an array:', transactions);
//       return res.status(500).json({ message: 'Unexpected data format received for transactions.' });
//     }

//     const uniqueTransactions = removeDuplicates(transactions);

//     // Process each transaction to fetch detailed information
//     const detailedTransactions = await Promise.all(
//       uniqueTransactions.map(async (transaction) => {
//         try {
//           // Fetch doctor information
//           const doctor = transaction.doctor
//             ? await getDoctorById(transaction.doctor, token)
//             : { first_name: 'Unknown', last_name: 'Doctor' };

//           // Fetch appointment details
//           const appointment = transaction.appointment
//             ? await fetchSingleData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
//             : {};

//           // Fetch line item details
//           const lineItem = transaction.line_item
//             ? await fetchSingleData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
//             : {};

//           // Fetch supervising provider information
//           const supervisingProvider = appointment.supervising_provider
//             ? await getDoctorById(appointment.supervising_provider, token)
//             : { first_name: '', last_name: '' };

//           // Fetch billing provider information
//           const billingProvider = appointment.billing_provider
//             ? await getDoctorById(appointment.billing_provider, token)
//             : { first_name: '', last_name: '' };

//           // Fetch office data
//           const officeData = appointment.office
//             ? await getOfficeById(appointment.office, token)
//             : {};

//           return {
//             service_date: lineItem.service_date || 'N/A',
//             last_billed_date: appointment.last_billed_date || 'N/A',
//             updated_at: lineItem.updated_at || 'N/A',
//             posted_date: lineItem.posted_date || 'N/A',
//             total_billed: lineItem.billed_amount || 'N/A',
//             provider: `${doctor.first_name} ${doctor.last_name}`.trim(),
//             supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//             billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
//             office: officeData.office || 'N/A',
//             primary_insurance_name: appointment.primary_insurer_name || 'N/A',
//             primary_insurance_id: appointment.primary_insurer_id || 'N/A',
//             secondary_insurance_name: appointment.secondary_insurer_name || 'N/A',
//             secondary_insurance_id: appointment.secondary_insurer_id || 'N/A',
//             patient_id: transaction.patient,
//             // patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
//             appointment_id: transaction.appointment || 'N/A',
//             // Add appointments profile
//             code: lineItem.code || 'N/A',
//             procedure_type: lineItem.procedure_type || 'N/A',
//           };
//         } catch (error) {
//           console.error('Error processing transaction:', error);
//           return null; // Skip this transaction if an error occurs
//         }
//       })
//     );

//     // Filter out any null transactions due to errors
//     const filteredDetailedTransactions = detailedTransactions.filter(tx => tx !== null);

//     console.log('Generated Charge Report:', filteredDetailedTransactions);
//     res.json(filteredDetailedTransactions);
//   } catch (error) {
//     console.error('Error generating Charge Report:', error.message);
//     res.status(500).json({ message: 'Failed to generate report.' });
//   }
// });

// module.exports = router;


// backend/routes/chargeReport.js

// const express = require('express');
// const axios = require('axios');
// const { getDoctorById, getPatientById, getOfficeById, getProfileById, dataCache } = require('./dataCache.js'); // Import shared caching
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

// // Function to remove duplicate transactions based on appointment and line_item
// const removeDuplicates = (transactions) => {
//   const seen = new Set();
//   return transactions.filter((transaction) => {
//     const uniqueId = `${transaction.appointment}-${transaction.line_item}`;
//     if (!seen.has(uniqueId)) {
//       seen.add(uniqueId);
//       return true;
//     }
//     return false;
//   });
// };

// // Route to generate the Charge Report with pagination
// router.get('/generate-charge-report', async (req, res) => {
//   const { start_date, next } = req.query;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     console.error('Access token is missing or invalid.');
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   // Make start_date and end_date required only if nextUrl is not provided
//   if (!next && (!start_date)) {
//     console.error('Start date and/or end date is missing.');
//     return res.status(400).json({ message: 'Start date and end date must be provided unless using next URL.' });
//   }

//   try {
//     let apiUrl = 'https://app.drchrono.com/api/transactions';
//     let params = { page_size: 100 };

//     if (next) {
//       // If nextUrl is provided, use it directly without additional params
//       apiUrl = decodeURIComponent(next); // Decode in case it's URL-encoded
//       params = {}; // Parameters are already included in the nextUrl
//       console.log(`Fetching next page using nextUrl: ${apiUrl}`);
//     } else {
//       // Initial fetch with date_range
//       params.since = `${start_date}`;
//       console.log(`Fetching initial page with date_range: ${params.since}`);
//     }

//     // Fetch a single page of transactions
//     const transactionsRes = await fetchSinglePage(apiUrl, token, params);
//     if (!transactionsRes) {
//       console.error('Failed to fetch transactions.');
//       return res.status(500).json({ message: 'Failed to fetch transactions.' });
//     }

//     const { results, next: newNextUrl } = transactionsRes;

//     // Remove duplicate transactions based on appointment and line_item
//     const uniqueTransactions = removeDuplicates(results);

//     // Process each transaction to fetch detailed information
//     const detailedTransactions = await Promise.all(
//       uniqueTransactions.map(async (transaction) => {
//         try {
//           // Fetch doctor information
//           const doctor = transaction.doctor
//             ? await getDoctorById(transaction.doctor, token)
//             : { first_name: 'Unknown', last_name: 'Doctor' };

//           // Fetch appointment details
//           const appointment = transaction.appointment
//             ? await fetchSinglePage(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
//             : {};

//           // Fetch line item details
//           const lineItem = transaction.line_item
//             ? await fetchSinglePage(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
//             : {};

//           // Fetch supervising provider information
//           const supervisingProvider = appointment.supervising_provider
//             ? await getDoctorById(appointment.supervising_provider, token)
//             : { first_name: '', last_name: '' };

//           // Fetch billing provider information
//           const billingProvider = appointment.billing_provider
//             ? await getDoctorById(appointment.billing_provider, token)
//             : { first_name: '', last_name: '' };

//           // Fetch office data
//           const office = appointment.office
//             ? await getOfficeById(appointment.office, token)
//             : { name: '' };
//           const patient = appointment.patient
//             ? await getPatientById(appointment.patient, token)
//             : { first_name: 'Unknown', last_name: 'Patient' };

//           const profile = appointment.profile
//             ? await getProfileById(appointment.profile, token)
//             : { name: '' };

//           return {
//             service_date: lineItem.service_date || '  ',
//             last_billed_date: appointment.last_billed_date || '  ',
//             updated_at: lineItem.updated_at || '  ',
//             posted_date: lineItem.posted_date || '  ',
//             total_billed: lineItem.billed_amount || '  ',
//             provider: `${doctor.first_name} ${doctor.last_name}`.trim(),
//             supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//             billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
//             office: office.name || '  ',
//             primary_insurance_name: appointment.primary_insurance_id_number || '  ',
//             primary_insurance_id: appointment.primary_insurer_payer_id || '  ',
//             secondary_insurance_name: appointment.secondary_insurer_name || '  ',
//             secondary_insurance_id: appointment.secondary_insurance_id_number || '  ',
//             patient_id: transaction.patient,
//             patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
//             appointment_id: transaction.appointment || '  ',
//             profile: profile.name || '  ',
//             code: lineItem.code || '  ',
//             procedure_type: lineItem.procedure_type || '  ',
//           };
//         } catch (error) {
//           console.error('Error processing transaction:', error);
//           return null; // Skip this transaction if an error occurs
//         }
//       })
//     );

//     // Filter out any null transactions due to errors
//     const filteredDetailedTransactions = detailedTransactions.filter(tx => tx !== null);

//     // Determine if there is a next page
//     const hasNextPage = newNextUrl ? true : false;

//     // Send the response
//     console.log(`Processed Charge Report - Current Page Count: ${filteredDetailedTransactions.length}`);
//     res.json({
//       data: filteredDetailedTransactions,
//       nextUrl: newNextUrl,
//       hasNextPage,
//     });
//   } catch (error) {
//     console.error('Error generating Charge Report:', error.message);
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Failed to generate report.' });
//     }
//   }
// });

// module.exports = router;


// --------- Above code is backup -------------


const express = require('express');
const axios = require('axios');
const {
  getDoctorById,
  getPatientById,
  getOfficeById,
  getProfileById,
  dataCache,
} = require('./dataCache.js'); // Import shared caching
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
    console.error(
      `Error fetching ${url}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Function to remove duplicate transactions based on appointment and line_item
const removeDuplicates = (transactions) => {
  const seen = new Set();
  return transactions.filter((transaction) => {
    const uniqueId = `${transaction.appointment}-${transaction.line_item}`;
    if (!seen.has(uniqueId)) {
      seen.add(uniqueId);
      return true;
    }
    return false;
  });
};

router.get('/generate-charge-report', async (req, res) => {
  const {
    start_date,
    next,
    provider,
    supervising_provider,
    billing_provider,
    office,
    profile,
  } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('Access token is missing or invalid.');
    return res
      .status(401)
      .json({ message: 'Access token is missing or invalid.' });
  }

  // Validate required parameters
  if (!next && !start_date) {
    console.error('Start date is missing.');
    return res
      .status(400)
      .json({ message: 'Start date must be provided unless using next URL.' });
  }

  // If provider is provided without start_date, prompt for start_date
  if (!next && provider && !start_date) {
    console.error('Start date is required when provider is specified.');
    return res
      .status(400)
      .json({ message: 'Start date is required when provider is specified.' });
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
      // Initial fetch with start_date and provider if available
      params.since = `${start_date}`;
      console.log(`Fetching initial page with start_date: ${params.since}`);

      if (provider) {
        params.doctor = provider;
        console.log(`Filtering transactions by doctor: ${provider}`);
      }
    }

    // Fetch a single page of transactions
    const transactionsRes = await fetchSinglePage(apiUrl, token, params);
    if (!transactionsRes) {
      console.error('Failed to fetch transactions.');
      return res.status(500).json({ message: 'Failed to fetch transactions.' });
    }

    const { results, next: newNextUrl } = transactionsRes;

    // Remove duplicate transactions based on appointment and line_item
    const uniqueTransactions = removeDuplicates(results);


    // Process each transaction to fetch detailed information
    const detailedTransactions = await Promise.all(
      uniqueTransactions.map(async (transaction) => {
        try {
          // Fetch doctor information
          const doctor = transaction.doctor
            ? await getDoctorById(transaction.doctor, token)
            : { first_name: 'Unknown', last_name: 'Doctor' };

          // Fetch appointment details
          const appointment = transaction.appointment
            ? await fetchSinglePage(
                `https://app.drchrono.com/api/appointments/${transaction.appointment}`,
                token
              )
            : {};

          // Fetch line item details
          const lineItem = transaction.line_item
            ? await fetchSinglePage(
                `https://app.drchrono.com/api/line_items/${transaction.line_item}`,
                token
              )
            : {};

          // Fetch supervising provider information
          const supervisingProvider = appointment.supervising_provider
            ? await getDoctorById(appointment.supervising_provider, token)
            : { first_name: '', last_name: '', id: null };

          // Fetch billing provider information
          const billingProvider = appointment.billing_provider
            ? await getDoctorById(appointment.billing_provider, token)
            : { first_name: '', last_name: '', id: null };

          // Fetch office data
          const officeData = appointment.office
            ? await getOfficeById(appointment.office, token)
            : { name: '', id: null };

          const patient = appointment.patient
            ? await getPatientById(appointment.patient, token)
            : { first_name: ' ', last_name: ' ' };

          const profile = appointment.profile
            ? await getProfileById(appointment.profile, token)
            : { name: '', id: null };

          return {
            service_date: lineItem.service_date || '  ',
            last_billed_date: appointment.last_billed_date || '  ',
            updated_at: lineItem.updated_at || '  ',
            posted_date: lineItem.posted_date || '  ',
            total_billed: lineItem.billed_amount || '  ',
            provider: `${doctor.first_name} ${doctor.last_name}`.trim(),
            provider_id: transaction.doctor,
            supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
            supervising_provider_id: appointment.supervising_provider,
            billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
            billing_provider_id: appointment.billing_provider,
            office: officeData.name || '  ',
            office_id: appointment.office,
            primary_insurance_name: appointment.primary_insurer_name || '  ',
            primary_insurance_id: appointment.primary_insurance_id_number || '  ',
            secondary_insurance_name: appointment.secondary_insurer_name || '  ',
            secondary_insurance_id: appointment.secondary_insurance_id_number || '  ',
            patient_id: transaction.patient,
            patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
            appointment_id: transaction.appointment || '  ',
            profile: profile.name || '  ',
            profile_id: appointment.profile,
            code: lineItem.code || '  ',
            procedure_type: lineItem.procedure_type || '  ',
          };
        } catch (error) {
          console.error('Error processing transaction:', error);
          return null; // Skip this transaction if an error occurs
        }
      })
    );

    // Filter out any null transactions due to errors
    const filteredDetailedTransactions = detailedTransactions.filter(
      (tx) => tx !== null
    );

    // Apply additional filters
    const finalTransactions = filteredDetailedTransactions.filter((tx) => {
      let match = true;
      if (supervising_provider) {
        match =
          match &&
          tx.supervising_provider_id === parseInt(supervising_provider);
      }
      if (billing_provider) {
        match =
          match && tx.billing_provider_id === parseInt(billing_provider);
      }
      if (office) {
        match = match && tx.office_id === parseInt(office);
      }
      if (profile) {
        match = match && tx.profile_id === parseInt(profile);
      }
      return match;
    });

    const hasNextPage = newNextUrl ? true : false;

    // Send the response
    res.json({
      data: finalTransactions,
      nextUrl: newNextUrl,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error generating Charge Report:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate report.' });
    }
  }
});


module.exports = router;

