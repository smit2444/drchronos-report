// // src/components/PaymentAnalysisReport.js
// import React, { useState } from 'react';
// import { Button, TextField, Grid, Box } from '@mui/material';
// import axios from 'axios';

// const PaymentAnalysisReport = () => {
//   const [sinceDate, setSinceDate] = useState('');

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem('access_token');

//       if (!token) {
//         console.error('No token found in localStorage!');
//         return;
//       }

//       const response = await axios.get('http://localhost:4000/api/generate-payment-analysis-report', {
//         params: { since: sinceDate },
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'payment_analysis_report.csv');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading Payment Analysis Report:', error);
//     }
//   };

//   return (
//     <Box p={3}>
//       <h1>Generate Payment Analysis Report</h1>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             label="Since (YYYY-MM-DD)"
//             type="date"
//             value={sinceDate}
//             onChange={(e) => setSinceDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>
//       </Grid>
//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={handleDownload}>
//           Download Payment Analysis Report
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default PaymentAnalysisReport;
// ------------------- Below code works

// import React, { useState, useEffect } from 'react';
// import {
//   Button, TextField, Grid, Box, FormControl, InputLabel,
//   Select, MenuItem, CircularProgress, Alert, Paper, Table,
//   TableBody, TableCell, TableContainer, TableHead, TableRow
// } from '@mui/material';
// import axios from 'axios';

// const PaymentAnalysisReport = () => {
//   const [Date, setDate] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [providers, setProviders] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchFilters = async () => {
//       const token = localStorage.getItem('access_token');
//       try {
//         const [providersRes, officesRes, profilesRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setProviders(providersRes.data);
//         setOffices(officesRes.data);
//         setProfiles(profilesRes.data);
//       } catch (error) {
//         console.error('Error fetching filter data:', error);
//       }
//     };
//     fetchFilters();
//   }, []);

//   const handleFetchData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await axios.get('http://localhost:4000/api/generate-payment-analysis-report', {
//         params: {
//           start_date: Date,
//           provider: selectedProvider,
//           // office: selectedOffice,
//           // profile: selectedProfile,
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReportData(response.data);
//     } catch (error) {
//       setError('Error fetching report data.');
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     const csvContent = [
//       [
//         'Posted Date','Service Date', 'Date of Payment', 'Total Billed', 'Allowed',
//         'Insurance1 Paid', 'Insurance2 Paid', 'Insurance3 Paid',
//         'Insurance Total', 'Patient Paid', 'Balance Total',
//         'Patient Balance', 'Provider', 'Supervising Provider',
//         'Billing Provider', 'Office', 'Primary Insurance ID',
//         'Primary Insurance Name', 'Secondary Insurance ID',
//         'Secondary Insurance Name', 'Patient', 'Appointment Profile',
//         'Appointment ID', 'Code', 'Procedure Type'
//       ],
//       ...reportData.map(row => [
//         row.posted_date,row.service_date, row.date_of_payment, row.total_billed,
//         row.allowed, row.insurance1_paid, row.insurance2_paid,
//         row.insurance3_paid, row.insurance_total, row.patient_paid,
//         row.balance_total, row.patient_balance, row.provider,
//         row.supervising_provider, row.billing_provider, row.office,
//         row.primary_insurance_id, row.primary_insurance_name,
//         row.secondary_insurance_id, row.secondary_insurance_name,
//         row.patient, row.appointment_profile, row.appointment_id,
//         row.code, row.procedure_type
//       ])
//     ].map(e => e.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'payment_analysis_report.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleClear = () => {
//     setDate('');
//     setSelectedProvider('');
//     setSelectedOffice('');
//     setSelectedProfile('');
//     setReportData([]);
//     setError('');
//   };

//   return (
//     <Box p={3}>
//       <h1>Payment Analysis Report</h1>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             label="Date" type="date" value={Date}
//             onChange={(e) => setDate(e.target.value)} fullWidth
//             InputLabelProps={{ shrink: true }}

//           />
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Provider</InputLabel>
//             <Select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
//               {providers.map(provider => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Office</InputLabel>
//             <Select value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
//               {offices.map(office => (
//                 <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Appointment Profile</InputLabel>
//             <Select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)}>
//               {profiles.map(profile => (
//                 <MenuItem key={profile.id} value={profile.id}>{profile.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading}>
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
//         </Button>
//         <Button variant="contained" color="secondary" onClick={handleClear} sx={{ ml: 2 }}>
//           Clear
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//       {reportData.length > 0 && (
//         <Paper sx={{ mt: 4, p: 2 }}>
//           <TableContainer sx={{ overflowX: 'auto', maxHeight: '600px', maxWidth: '1200px' }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Posted Date</TableCell>
//                   <TableCell>Service Date</TableCell>
//                   <TableCell>Date of Payment</TableCell>
//                   <TableCell>Total Billed</TableCell>
//                   <TableCell>Allowed</TableCell>
//                   <TableCell>Insurance1 Paid</TableCell>
//                   <TableCell>Insurance2 Paid</TableCell>
//                   <TableCell>Insurance3 Paid</TableCell>
//                   <TableCell>Insurance Total</TableCell>
//                   <TableCell>Patient Paid</TableCell>
//                   <TableCell>Balance Total</TableCell>
//                   <TableCell>Patient Balance</TableCell>
//                   <TableCell>Provider</TableCell>
//                   <TableCell>Supervising Provider</TableCell>
//                   <TableCell>Billing Provider</TableCell>
//                   <TableCell>Office</TableCell>
//                   <TableCell>Primary Insurance ID</TableCell>
//                   <TableCell>Primary Insurance Name</TableCell>
//                   <TableCell>Secondary Insurance ID</TableCell>
//                   <TableCell>Secondary Insurance Name</TableCell>
//                   <TableCell>Patient</TableCell>
//                   <TableCell>Appointment Profile</TableCell>
//                   <TableCell>Appointment ID</TableCell>
//                   <TableCell>Code</TableCell>
//                   <TableCell>Procedure Type</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportData.map((row, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{row.posted_date}</TableCell>
//                     <TableCell>{row.service_date}</TableCell>
//                     <TableCell>{row.date_of_payment}</TableCell>
//                     <TableCell>{row.total_billed}</TableCell>
//                     <TableCell>{row.allowed}</TableCell>
//                     <TableCell>{row.insurance1_paid}</TableCell>
//                     <TableCell>{row.insurance2_paid}</TableCell>
//                     <TableCell>{row.insurance3_paid}</TableCell>
//                     <TableCell>{row.insurance_total}</TableCell>
//                     <TableCell>{row.patient_paid}</TableCell>
//                     <TableCell>{row.balance_total}</TableCell>
//                     <TableCell>{row.patient_balance}</TableCell>
//                     <TableCell>{row.provider}</TableCell>
//                     <TableCell>{row.supervising_provider}</TableCell>
//                     <TableCell>{row.billing_provider}</TableCell>
//                     <TableCell>{row.office}</TableCell>
//                     <TableCell>{row.primary_insurance_id}</TableCell>
//                     <TableCell>{row.primary_insurance_name}</TableCell>
//                     <TableCell>{row.secondary_insurance_id}</TableCell>
//                     <TableCell>{row.secondary_insurance_name}</TableCell>
//                     <TableCell>{row.patient}</TableCell>
//                     <TableCell>{row.appointment_profile}</TableCell>
//                     <TableCell>{row.appointment_id}</TableCell>
//                     <TableCell>{row.code}</TableCell>
//                     <TableCell>{row.procedure_type}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Box mt={2}>
//             <Button variant="contained" color="primary" onClick={handleDownload}>
//               Download CSV
//             </Button>
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default PaymentAnalysisReport;


// frontend/src/components/PaymentAnalysisReport.js

// frontend/src/components/PaymentAnalysisReport.js
// frontend/src/components/PaymentAnalysisReport.js
// frontend/src/components/PaymentAnalysisReport.js
// ------ Below code works fantastically -----
// import React, { useState, useEffect } from 'react';
// import {
//   Button, TextField, Grid, Box, FormControl, InputLabel,
//   Select, MenuItem, CircularProgress, Alert, Paper, Table,
//   TableBody, TableCell, TableContainer, TableHead, TableRow
// } from '@mui/material';
// import axios from 'axios';

// const PaymentAnalysisReport = () => {
//   const [date, setDate] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [providers, setProviders] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false); // State for loading more data
//   const [error, setError] = useState('');
//   const [nextUrl, setNextUrl] = useState(null); // State to store the next URL

//   useEffect(() => {
//     const fetchFilters = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         setError('Access token is missing. Please log in.');
//         return;
//       }
//       try {
//         const [providersRes, officesRes, profilesRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setProviders(providersRes.data);
//         setOffices(officesRes.data);
//         setProfiles(profilesRes.data);
//       } catch (error) {
//         console.error('Error fetching filter data:', error);
//         setError('Failed to fetch filter data.');
//       }
//     };
//     fetchFilters();
//   }, []);

//   // Function to fetch data, either initial or next page
//   const fetchData = async (isLoadMore = false) => {
//     if (isLoadMore && !nextUrl) {
//       console.log('No next URL available.');
//       return; // No more data to load
//     }

//     if (isLoadMore) {
//       setLoadingMore(true);
//     } else {
//       setLoading(true);
//       setReportData([]); // Clear previous data on initial fetch
//       setNextUrl(null); // Reset nextUrl
//     }

//     setError('');

//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         setError('Access token is missing. Please log in.');
//         setLoading(false);
//         setLoadingMore(false);
//         return;
//       }

//       let params = {};
//       if (!isLoadMore) {
//         params = {
//           start_date: date,
//           provider: selectedProvider,
//           // office: selectedOffice,
//           // profile: selectedProfile,
//         };
//       } else {
//         // Pass the nextUrl directly without encoding
//         params = {
//           next: nextUrl, // Pass the nextUrl directly
//         };
//       }

//       console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);

//       const response = await axios.get('http://localhost:4000/api/generate-payment-analysis-report', {
//         params: params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log('Backend Response:', response.data);

//       const { data, nextUrl: newNextUrl, hasNextPage } = response.data;

//       if (isLoadMore) {
//         setReportData((prevData) => [...prevData, ...data]);
//       } else {
//         setReportData(data);
//       }

//       setNextUrl(hasNextPage ? newNextUrl : null);
//     } catch (error) {
//       console.error('Error fetching report data:', error);
//       setError('Error fetching report data.');
//     } finally {
//       if (isLoadMore) {
//         setLoadingMore(false);
//       } else {
//         setLoading(false);
//       }
//     }
//   };

//   // Handler for the initial fetch
//   const handleFetchData = () => {
//     if (!date || !selectedProvider) {
//       setError('Please select a date and provider.');
//       return;
//     }
//     fetchData(false);
//   };

//   // Handler for loading more data
//   const handleLoadMore = () => {
//     fetchData(true);
//   };

  // const handleDownload = () => {
  //   if (reportData.length === 0) {
  //     setError('No data to download.');
  //     return;
  //   }

  //   const headers = [
  //     'Posted Date','Service Date', 'Date of Payment', 'Total Billed', 'Allowed',
  //     'Insurance1 Paid', 'Insurance2 Paid', 'Insurance3 Paid',
  //     'Insurance Total', 'Patient Paid', 'Balance Total',
  //     'Patient Balance', 'Provider', 'Supervising Provider',
  //     'Billing Provider', 'Office', 'Primary Insurance ID',
  //     'Primary Insurance Name', 'Secondary Insurance ID',
  //     'Secondary Insurance Name', 'Patient', 'Appointment Profile',
  //     'Appointment ID', 'Code', 'Procedure Type'
  //   ];

  //   const csvContent = [
  //     headers.join(','), // Header row
  //     ...reportData.map(row => [
  //       row.posted_date, row.service_date, row.date_of_payment, row.total_billed,
  //       row.allowed, row.insurance1_paid, row.insurance2_paid,
  //       row.insurance3_paid, row.insurance_total, row.patient_paid,
  //       row.balance_total, row.patient_balance, row.provider,
  //       row.supervising_provider, row.billing_provider, row.office,
  //       row.primary_insurance_id, row.primary_insurance_name,
  //       row.secondary_insurance_id, row.secondary_insurance_name,
  //       row.patient, row.appointment_profile, row.appointment_id,
  //       row.code, row.procedure_type
  //     ].map(item => `"${item}"`).join(',')) // Data rows with quotes to handle commas
  //   ].join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', 'payment_analysis_report.csv');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

//   const handleClear = () => {
//     setDate('');
//     setSelectedProvider('');
//     setSelectedOffice('');
//     setSelectedProfile('');
//     setReportData([]);
//     setError('');
//     setNextUrl(null);
//   };

//   return (
//     <Box p={3}>
//       <h1>Payment Analysis Report</h1>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             label="Date"
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth>
//             <InputLabel>Provider</InputLabel>
//             <Select
//               value={selectedProvider}
//               onChange={(e) => setSelectedProvider(e.target.value)}
//             >
//               {providers.map(provider => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         {/* Uncomment and use if you need Office and Profile filters */}
//         {/*
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth>
//             <InputLabel>Office</InputLabel>
//             <Select
//               value={selectedOffice}
//               onChange={(e) => setSelectedOffice(e.target.value)}
//             >
//               {offices.map(office => (
//                 <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth>
//             <InputLabel>Appointment Profile</InputLabel>
//             <Select
//               value={selectedProfile}
//               onChange={(e) => setSelectedProfile(e.target.value)}
//             >
//               {profiles.map(profile => (
//                 <MenuItem key={profile.id} value={profile.id}>{profile.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         */}
//       </Grid>

//       <Box mt={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleFetchData}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
//         </Button>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleClear}
//           sx={{ ml: 2 }}
//         >
//           Clear
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

const PaymentAnalysisReport = () => {
  const [date, setDate] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedSupervisingProvider, setSelectedSupervisingProvider] =
    useState('');
  const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [providers, setProviders] = useState([]);
  const [offices, setOffices] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [nextUrl, setNextUrl] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Access token is missing. Please log in.');
        return;
      }
      try {
        const [providersRes, officesRes, profilesRes] = await Promise.all([
          axios.get('https://drchronos-report.onrender.com/api/doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://drchronos-report.onrender.com/api/offices', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://drchronos-report.onrender.com/api/appointment_profiles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProviders(providersRes.data);
        setOffices(officesRes.data);
        setProfiles(profilesRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        setError('Failed to fetch filter data.');
      }
    };
    fetchFilters();
  }, []);

  const fetchData = async (isLoadMore = false) => {
    if (isLoadMore && !nextUrl) {
      console.log('No next URL available.');
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setReportData([]);
      setNextUrl(null);
    }

    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Access token is missing. Please log in.');
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const params = {
        next: isLoadMore ? nextUrl : undefined,
        start_date: !isLoadMore ? date : undefined,
        provider: selectedProvider || undefined,
        supervising_provider: selectedSupervisingProvider || undefined,
        billing_provider: selectedBillingProvider || undefined,
        office: selectedOffice || undefined,
        profile: selectedProfile || undefined,
      };

      console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);

      const response = await axios.get(
        'https://drchronos-report.onrender.com/api/generate-payment-analysis-report',
        {
          params: params,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Backend Response:', response.data);

      const { data, nextUrl: newNextUrl, hasNextPage } = response.data;

      if (isLoadMore) {
        setReportData((prevData) => [...prevData, ...data]);
      } else {
        setReportData(data);
      }

      setNextUrl(hasNextPage ? newNextUrl : null);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Error fetching report data.');
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleFetchData = () => {
    if (!date) {
      setError('Please select a date.');
      return;
    }
    fetchData(false);
  };

  const handleLoadMore = () => {
    fetchData(true);
  };

  const handleDownload = () => {
    if (reportData.length === 0) {
      setError('No data to download.');
      return;
    }

    const headers = [
      'Posted Date','Service Date', 'Date of Payment', 'Total Billed', 'Allowed',
      'Insurance1 Paid', 'Insurance2 Paid', 'Insurance3 Paid',
      'Insurance Total', 'Patient Paid', 'Balance Total',
      'Patient Balance', 'Provider', 'Supervising Provider',
      'Billing Provider', 'Office', 'Primary Insurance ID',
      'Primary Insurance Name', 'Secondary Insurance ID',
      'Secondary Insurance Name', 'Patient', 'Appointment Profile',
      'Appointment ID', 'Code', 'Procedure Type'
    ];

    const csvContent = [
      headers.join(','), // Header row
      ...reportData.map(row => [
        row.posted_date, row.service_date, row.date_of_payment, row.total_billed,
        row.allowed, row.insurance1_paid, row.insurance2_paid,
        row.insurance3_paid, row.insurance_total, row.patient_paid,
        row.balance_total, row.patient_balance, row.provider,
        row.supervising_provider, row.billing_provider, row.office,
        row.primary_insurance_id, row.primary_insurance_name,
        row.secondary_insurance_id, row.secondary_insurance_name,
        row.patient, row.appointment_profile, row.appointment_id,
        row.code, row.procedure_type
      ].map(item => `"${item}"`).join(',')) // Data rows with quotes to handle commas
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payment_analysis_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleClear = () => {
    setDate('');
    setSelectedProvider('');
    setSelectedSupervisingProvider('');
    setSelectedBillingProvider('');
    setSelectedOffice('');
    setSelectedProfile('');
    setReportData([]);
    setError('');
    setNextUrl(null);
  };

  return (
    <Box sx={{p: 3, width:'100%', overflow: 'hidden'  }}>
      <Typography variant="h4" gutterBottom>
        Generate Payment Analysis Report
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Supervising Provider Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Supervising Provider</InputLabel>
            <Select
              value={selectedSupervisingProvider}
              onChange={(e) => setSelectedSupervisingProvider(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Billing Provider Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Billing Provider</InputLabel>
            <Select
              value={selectedBillingProvider}
              onChange={(e) => setSelectedBillingProvider(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Office Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Office</InputLabel>
            <Select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {offices.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Appointment Profile Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Appointment Profile</InputLabel>
            <Select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {profiles.map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                  {profile.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClear}
          sx={{ ml: 2 }}
        >
          Clear
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {reportData.length > 0 && (
        <Paper sx={{ width: '100%', mt: 1, p:1,overflow: 'hidden', border: '1px solid #ccc', borderRadius: '10px', }}>
          <TableContainer sx={{ maxHeight: 600, overflowX: 'auto', mt: 1  }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Posted Date</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Date of Payment</TableCell>
                  <TableCell>Total Billed</TableCell>
                  <TableCell>Allowed</TableCell>
                  <TableCell>Insurance1 Paid</TableCell>
                  <TableCell>Insurance2 Paid</TableCell>
                  <TableCell>Insurance3 Paid</TableCell>
                  <TableCell>Insurance Total</TableCell>
                  <TableCell>Patient Paid</TableCell>
                  <TableCell>Balance Total</TableCell>
                  <TableCell>Patient Balance</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Supervising Provider</TableCell>
                  <TableCell>Billing Provider</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Primary Insurance ID</TableCell>
                  <TableCell>Primary Insurance Name</TableCell>
                  <TableCell>Secondary Insurance ID</TableCell>
                  <TableCell>Secondary Insurance Name</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Appointment Profile</TableCell>
                  <TableCell>Appointment ID</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Procedure Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((row, index) => (
                  <TableRow key={`${row.appointment_id}-${index}`}>
                    <TableCell>{row.posted_date}</TableCell>
                    <TableCell>{row.service_date}</TableCell>
                    <TableCell>{row.date_of_payment}</TableCell>
                    <TableCell>{row.total_billed}</TableCell>
                    <TableCell>{row.allowed}</TableCell>
                    <TableCell>{row.insurance1_paid}</TableCell>
                    <TableCell>{row.insurance2_paid}</TableCell>
                    <TableCell>{row.insurance3_paid}</TableCell>
                    <TableCell>{row.insurance_total}</TableCell>
                    <TableCell>{row.patient_paid}</TableCell>
                    <TableCell>{row.balance_total}</TableCell>
                    <TableCell>{row.patient_balance}</TableCell>
                    <TableCell>{row.provider}</TableCell>
                    <TableCell>{row.supervising_provider}</TableCell>
                    <TableCell>{row.billing_provider}</TableCell>
                    <TableCell>{row.office}</TableCell>
                    <TableCell>{row.primary_insurance_id}</TableCell>
                    <TableCell>{row.primary_insurance_name}</TableCell>
                    <TableCell>{row.secondary_insurance_id}</TableCell>
                    <TableCell>{row.secondary_insurance_name}</TableCell>
                    <TableCell>{row.patient}</TableCell>
                    <TableCell>{row.appointment_profile}</TableCell>
                    <TableCell>{row.appointment_id}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.procedure_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              disabled={loading || loadingMore}
            >
              Download CSV
            </Button>
            {nextUrl && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentAnalysisReport;
