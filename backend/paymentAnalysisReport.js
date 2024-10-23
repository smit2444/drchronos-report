// // backend/routes/paymentAnalysisReport.js
// const express = require('express');
// const axios = require('axios');
// const { Parser } = require('json2csv');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Utility to fetch data with a token passed from the frontend
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


// router.get('/generate-payment-analysis-report', async (req, res) => {
//   const { since } = req.query;
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
//   console.log('token',token)

//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid' });
//   }

//   try {
//     const response = await axios.get(
//       `https://app.drchrono.com/api/transactions?page_size=10&since=${since}`,
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
//           id: transaction.id,
//           service_date: lineItemDetails.service_date || null,
//           updated_at: lineItemDetails.updated_at || null,
//           posted_date: lineItemDetails.posted_date || null,
//           date_of_payment: transaction.check_date || null,
//           total_billed: lineItemDetails.billed_amount || null,
//           provider: doctorName ? `${doctorName.first_name} ${doctorName.last_name}` : null,
//           supervising_provider: appointmentDetails.supervising_provider || null,
//           billing_provider: appointmentDetails.billing_provider || null,
//           office: appointmentDetails.office || null,
//           primary_insurance_id: appointmentDetails.primary_insurance_id_number || null,
//           primary_insurance_name: appointmentDetails.primary_insurer_name || null,
//           secondary_insurance_id: appointmentDetails.secondary_insurance_id_number || null,
//           secondary_insurance_name: appointmentDetails.secondary_insurer_name || null,
//           patient: patientName ? `${patientName.first_name} ${patientName.last_name}` : null,
//           appointment_profile: appointmentDetails.profile || null,
//           appointment_id: transaction.appointment || null,
//           code: lineItemDetails.code || null,
//           procedure_type: lineItemDetails.procedure_type || null,
//           allowed: lineItemDetails.allowed || null,
//           insurance1_paid: lineItemDetails.ins1_paid || null,
//           insurance2_paid: lineItemDetails.ins2_paid || null,
//           insurance3_paid: lineItemDetails.ins3_paid || null,
//           insurance_total: lineItemDetails.ins_total || null,
//           patient_paid: lineItemDetails.pt_paid || null,
//           balance_total: lineItemDetails.balance_total || null,
//           patient_balance: lineItemDetails.balance_pt || null,
//         };
//       })
//     );

//     const fields = [
//       'service_date',
//       'date_of_payment',
//       'total_billed',
//       'allowed',
//       'insurance1_paid',
//       'insurance2_paid',
//       'insurance3_paid',
//       'insurance_total',
//       'patient_paid',
//       'balance_total',
//       'patient_balance',
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

//     const filePath = path.join(__dirname, 'payment_analysis_report.csv');
//     fs.writeFileSync(filePath, csv);

//     // Send the CSV file as a response for download
//     res.download(filePath, 'payment_analysis_report.csv', (err) => {
//       if (err) {
//         console.error('Error sending the file:', err);
//         res.status(500).send('Failed to download Payment Analysis Report');
//       }
//     });
//   } catch (error) {
//     console.error('Error generating Payment Analysis Report:', error.message);
//     res.status(500).json({ message: 'Failed to generate Payment Analysis Report' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const axios = require('axios');
// const { Parser } = require('json2csv');
// const path = require('path');
// const fs = require('fs');
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
//     return null;
//   }
// };

// // Remove duplicate transactions
// const removeDuplicates = (transactions) => {
//   const seen = new Set();
//   return transactions.filter((transaction) => {
//     const uniqueId = `${transaction.appointment}`;
//     if (!seen.has(uniqueId)) {
//       seen.add(uniqueId);
//       return true;
//     }
//     return false;
//   });
// };

// // Route to generate Payment Analysis Report
// router.get('/generate-payment-analysis-report', async (req, res) => {
//   const { start_date, provider } = req.query;

//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });

//   if (!start_date) {
//     return res.status(400).json({ message: 'Start date and end date must be provided.' });
//   }

//   try {
//     // Fetch transactions
//     const params = { posted_date: `${start_date}`, page_size: 250 } ;   const response = await fetchData('https://app.drchrono.com/api/transactions', token, params);
//     let transactions = response.results || [];
//     transactions = removeDuplicates(transactions);

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
//         const appointmentDetails = transaction.appointment 
//           ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token) 
//           : {};
//         const lineItem = transaction.line_item 
//           ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token) 
//           : {};

//         return {
//           posted_date: transaction.posted_date || ' ',
//           service_date: lineItem.service_date || ' ',
//           date_of_payment: transaction.check_date || ' ',
//           total_billed: lineItem.billed_amount || ' ',
//           allowed: lineItem.allowed || ' ',
//           insurance1_paid: lineItem.ins1_paid || ' ',
//           insurance2_paid: lineItem.ins2_paid || ' ',
//           insurance3_paid: lineItem.ins3_paid || ' ',
//           insurance_total: lineItem.ins_total || ' ',
//           patient_paid: lineItem.pt_paid || ' ',
//           balance_total: lineItem.balance_total || ' ',
//           patient_balance: lineItem.balance_pt || ' ',
//           provider: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || ' ',
//           supervising_provider: appointmentDetails.supervising_provider || ' ',
//           billing_provider: appointmentDetails.billing_provider || ' ',
//           office: officeData.name || ' ',
//           primary_insurance_id: appointmentDetails.primary_insurance_id_number || ' ',
//           primary_insurance_name: appointmentDetails.primary_insurer_name || ' ',
//           secondary_insurance_id: appointmentDetails.secondary_insurance_id_number || ' ',
//           secondary_insurance_name: appointmentDetails.secondary_insurer_name || ' ',
//           patient: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || ' ',
//           appointment_profile: appointmentDetails.profile || ' ',
//           appointment_id: transaction.appointment || ' ',
//           code: lineItem.code || ' ',
//           procedure_type: lineItem.procedure_type || ' ',
//         };
//       })
//     );

//     console.log('Processed Payment Analysis Report:', detailedTransactions);
//     res.json(detailedTransactions);
//   } catch (error) {
//     console.error('Failed to fetch Payment Analysis:', error);
//     res.status(500).json({ message: 'Failed to fetch Payment Analysis', error: error.message });
//   }
// });

// module.exports = router;


// ------ Below code works fantastically ------

// backend/routes/paymentAnalysisReport.js

// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// const { getDoctorById, getOfficeById, getPatientById, dataCache } = require('./dataCache.js');


// // Helper function to fetch data from DrChrono API
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
//     console.error(`Error fetching ${url}:`, error.message);
//     return null;
//   }
// };

// // Remove duplicate transactions
// const removeDuplicates = (transactions) => {
//   const seen = new Set();
//   return transactions.filter((transaction) => {
//     const uniqueId = `${transaction.appointment}`;
//     if (!seen.has(uniqueId)) {
//       seen.add(uniqueId);
//       return true;
//     }
//     return false;
//   });
// };

// // Route to generate Payment Analysis Report with pagination
// router.get('/generate-payment-analysis-report', async (req, res) => {
//   const { start_date, provider, next } = req.query;

//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     console.error('Access token is missing or invalid.');
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   if (!next && !start_date) {
//     return res.status(400).json({ message: 'Start date must be provided unless using next URL.' });
//   }

//   try {
//     let apiUrl = 'https://app.drchrono.com/api/transactions';
//     let params = { page_size: 250, posted_date: `${start_date}` };

//     if (next) {
//       apiUrl = decodeURIComponent(next); // Decode the URL if it was encoded
//       params = {}; // Parameters are already included in the 'next' URL
//       console.log(`Fetching next page using nextUrl: ${apiUrl}`);
//     } else {
//       console.log(`Fetching initial page with start_date: ${start_date}`);
//     }

//     // Fetch transactions
//     const response = await fetchData(apiUrl, token, params);

//     if (!response) {
//       console.error('Failed to fetch transactions.');
//       return res.status(500).json({ message: 'Failed to fetch transactions.' });
//     }

//     let transactions = response.results || [];
//     transactions = removeDuplicates(transactions);

//     // Fetch detailed information for each transaction
//     const detailedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         const doctor = transaction.doctor
//           ? await getDoctorById(transaction.doctor, token)
//           : { first_name: '', last_name: '' };
//         // const patient = transaction.patient
//         //   ? await fetchData(`https://app.drchrono.com/api/patients/${transaction.patient}`, token)
//         //   : {};
//         // const officeData = transaction.office
//         //   ? await fetchData(`https://app.drchrono.com/api/offices/${appointment.office}`, token)
//         //   : {};
//         const appointmentDetails = transaction.appointment
//           ? await fetchData(`https://app.drchrono.com/api/appointments/${transaction.appointment}`, token)
//           : {};
//         const lineItem = transaction.line_item
//           ? await fetchData(`https://app.drchrono.com/api/line_items/${transaction.line_item}`, token)
//           : {};

//         const supervisingProvider = appointmentDetails.supervising_provider
//           ? await getDoctorById(appointmentDetails.supervising_provider, token)
//           : { first_name: '', last_name: '' };
//         const billingProvider = appointmentDetails.billing_provider
//           ? await getDoctorById(appointmentDetails.billing_provider, token)
//           : { first_name: '', last_name: '' };

//         const patient = appointmentDetails.patient
//           ? await getPatientById(appointmentDetails.patient, token)
//           : { first_name: 'Unknown', last_name: 'Patient' };
//         const office = appointmentDetails.office
//           ? await getOfficeById(appointmentDetails.office, token)
//           : { name: '' };

//         return {
//           posted_date: transaction.posted_date || ' ',
//           service_date: lineItem.service_date || ' ',
//           date_of_payment: transaction.check_date || ' ',
//           total_billed: lineItem.billed_amount || ' ',
//           allowed: lineItem.allowed || ' ',
//           insurance1_paid: lineItem.ins1_paid || ' ',
//           insurance2_paid: lineItem.ins2_paid || ' ',
//           insurance3_paid: lineItem.ins3_paid || ' ',
//           insurance_total: lineItem.ins_total || ' ',
//           patient_paid: lineItem.pt_paid || ' ',
//           balance_total: lineItem.balance_total || ' ',
//           patient_balance: lineItem.balance_pt || ' ',
//           provider: `${doctor.first_name} ${doctor.last_name}`.trim(),
//           supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
//           billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
//           office: office.name || ' ',
//           primary_insurance_id: appointmentDetails.primary_insurance_id_number || ' ',
//           primary_insurance_name: appointmentDetails.primary_insurer_name || ' ',
//           secondary_insurance_id: appointmentDetails.secondary_insurance_id_number || ' ',
//           secondary_insurance_name: appointmentDetails.secondary_insurer_name || ' ',
//           patient: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || ' ',
//           appointment_profile: appointmentDetails.profile || ' ',
//           appointment_id: transaction.appointment || ' ',
//           code: lineItem.code || ' ',
//           procedure_type: lineItem.procedure_type || ' ',
//         };
//       })
//     );

//     // Determine if there is a next page
//     const hasNextPage = response.next ? true : false;

//     console.log(`Processed Payment Analysis Report - Transactions Count: ${detailedTransactions.length}`);
//     res.json({
//       data: detailedTransactions,
//       nextUrl: response.next, // Provide the new 'next' URL from the API
//       hasNextPage,
//     });
//   } catch (error) {
//     console.error('Failed to fetch Payment Analysis:', error);
//     res.status(500).json({ message: 'Failed to fetch Payment Analysis', error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  getDoctorById,
  getOfficeById,
  getPatientById,
  dataCache,
} = require('./dataCache.js');

// Helper function to fetch data from DrChrono API
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
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
};

// Remove duplicate transactions
const removeDuplicates = (transactions) => {
  const seen = new Set();
  return transactions.filter((transaction) => {
    const uniqueId = `${transaction.appointment}`;
    if (!seen.has(uniqueId)) {
      seen.add(uniqueId);
      return true;
    }
    return false;
  });
};

// Route to generate Payment Analysis Report with pagination
router.get('/generate-payment-analysis-report', async (req, res) => {
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
    return res.status(400).json({
      message: 'Start date must be provided unless using next URL.',
    });
  }

  // If provider is provided without start_date, prompt for start_date
  if (!next && provider && !start_date) {
    console.error('Start date is required when provider is specified.');
    return res.status(400).json({
      message: 'Start date is required when provider is specified.',
    });
  }

  try {
    let apiUrl = 'https://app.drchrono.com/api/transactions';
    let params = { page_size: 250 };

    if (next) {
      apiUrl = decodeURIComponent(next);
      params = {};
      console.log(`Fetching next page using nextUrl: ${apiUrl}`);
    } else {
      params.posted_date = `${start_date}`;
      console.log(`Fetching initial page with start_date: ${start_date}`);

      if (provider) {
        params.doctor = provider;
        console.log(`Filtering transactions by doctor: ${provider}`);
      }
    }

    // Fetch transactions
    const response = await fetchData(apiUrl, token, params);

    if (!response) {
      console.error('Failed to fetch transactions.');
      return res
        .status(500)
        .json({ message: 'Failed to fetch transactions.' });
    }

    let transactions = response.results || [];
    transactions = removeDuplicates(transactions);

    // Fetch detailed information for each transaction
    const detailedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const doctor = transaction.doctor
          ? await getDoctorById(transaction.doctor, token)
          : { first_name: '', last_name: '', id: null };
        const appointmentDetails = transaction.appointment
          ? await fetchData(
              `https://app.drchrono.com/api/appointments/${transaction.appointment}`,
              token
            )
          : {};
        const lineItem = transaction.line_item
          ? await fetchData(
              `https://app.drchrono.com/api/line_items/${transaction.line_item}`,
              token
            )
          : {};

        const supervisingProvider = appointmentDetails.supervising_provider
          ? await getDoctorById(
              appointmentDetails.supervising_provider,
              token
            )
          : { first_name: '', last_name: '', id: null };
        const billingProvider = appointmentDetails.billing_provider
          ? await getDoctorById(
              appointmentDetails.billing_provider,
              token
            )
          : { first_name: '', last_name: '', id: null };

        const patient = appointmentDetails.patient
          ? await getPatientById(appointmentDetails.patient, token)
          : {
              first_name: ' ',
              last_name: ' ',
              id: null,
            };
        const office = appointmentDetails.office
          ? await getOfficeById(appointmentDetails.office, token)
          : { name: '', id: null };

        return {
          posted_date: transaction.posted_date || ' ',
          service_date: lineItem.service_date || ' ',
          date_of_payment: transaction.check_date || ' ',
          total_billed: lineItem.billed_amount || ' ',
          allowed: lineItem.allowed || ' ',
          insurance1_paid: lineItem.ins1_paid || ' ',
          insurance2_paid: lineItem.ins2_paid || ' ',
          insurance3_paid: lineItem.ins3_paid || ' ',
          insurance_total: lineItem.ins_total || ' ',
          patient_paid: lineItem.pt_paid || ' ',
          balance_total: lineItem.balance_total || ' ',
          patient_balance: lineItem.balance_pt || ' ',
          provider: `${doctor.first_name} ${doctor.last_name}`.trim(),
          provider_id: transaction.doctor,
          supervising_provider: `${supervisingProvider.first_name} ${supervisingProvider.last_name}`.trim(),
          supervising_provider_id: appointmentDetails.supervising_provider,
          billing_provider: `${billingProvider.first_name} ${billingProvider.last_name}`.trim(),
          billing_provider_id: appointmentDetails.billing_provider,
          office: office.name || ' ',
          office_id: appointmentDetails.office,
          primary_insurance_id:
            appointmentDetails.primary_insurance_id_number || ' ',
          primary_insurance_name:
            appointmentDetails.primary_insurer_name || ' ',
          secondary_insurance_id:
            appointmentDetails.secondary_insurance_id_number || ' ',
          secondary_insurance_name:
            appointmentDetails.secondary_insurer_name || ' ',
          patient:
            `${patient.first_name || ''} ${patient.last_name || ''}`.trim() ||
            ' ',
          appointment_profile: appointmentDetails.profile || ' ',
          profile_id: appointmentDetails.profile,
          appointment_id: transaction.appointment || ' ',
          code: lineItem.code || ' ',
          procedure_type: lineItem.procedure_type || ' ',
        };
      })
    );

    // Apply additional filters
    const finalTransactions = detailedTransactions.filter((tx) => {
      if (tx === null) return false; // Exclude null entries

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

    // Determine if there is a next page
    const hasNextPage = response.next ? true : false;

    console.log(
      `Processed Payment Analysis Report - Transactions Count: ${finalTransactions.length}`
    );
    res.json({
      data: finalTransactions,
      nextUrl: response.next,
      hasNextPage,
    });
  } catch (error) {
    console.error('Failed to fetch Payment Analysis:', error);
    res.status(500).json({
      message: 'Failed to fetch Payment Analysis',
      error: error.message,
    });
  }
});

module.exports = router;
