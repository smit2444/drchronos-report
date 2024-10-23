// // src/components/DenialReport.js
// import React, { useState } from 'react';
// import { Button, TextField, Grid, Box } from '@mui/material';
// import axios from 'axios';

// const DenialReport = () => {
//   const [sinceDate, setSinceDate] = useState('');

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem('access_token'); // Get token from localStorage

//       if (!token) {
//         console.error('No token found in localStorage!');
//         return;
//       }

//       const response = await axios.get('http://localhost:4000/api/generate-denial-report', {
//         params: { since: sinceDate },
//         headers: { Authorization: `Bearer ${token}` }, // Pass token in header
//         responseType: 'blob', // Important for file download
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'denial_report.csv'); // File name
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading Denial Report:', error);
//     }
//   };

//   return (
//     <Box p={3}>
//       <h1>Generate Denial Report</h1>
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
//           Download Denial Report
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// // export default DenialReport;
// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   TextField,
//   Grid,
//   Box,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import axios from 'axios';

// // Adjustment Reason Codes List
// const adjustmentReasonCodes = [
//   { code: '-3', description: 'Insurance Payment' },
//   { code: '-2', description: 'Patient Bad Debt Writeoff' },
//   { code: '-4', description: 'Insurance Bad Debt Writeoff' },
//   { code: '-1', description: 'Transfer Balance to Patient' },
//   { code: '0', description: 'Provider Discount' },
//   { code: '1', description: '1: Deductible Amount' },
//   { code: '2', description: '2: Coinsurance Amount' },
//   { code: '3', description: '3: Co-payment Amount' },
//   { 
//     code: '4', 
//     description: '4: Procedure code inconsistency with modifier or missing modifier.'
//   },
// ];

// const DenialReport = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState('');
//   const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
//   const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [selectedAdjustmentCode, setSelectedAdjustmentCode] = useState('');
//   const [reportData, setReportData] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
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

//     fetchData();
//   }, []);

//   const handleFetchData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await axios.get('http://localhost:4000/api/generate-denial-report', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           start_date: startDate,
//           // end_date: endDate,
//           provider: selectedProvider || undefined,
//           supervising_provider: selectedSupervisingProvider || undefined,
//           billing_provider: selectedBillingProvider || undefined,
//           office: selectedOffice || undefined,
//           profile: selectedProfile || undefined,
//           adjustment_code: selectedAdjustmentCode || undefined,
//         },
//       });

//       setReportData(response.data);
//     } catch (error) {
//       setError('Failed to fetch the report.');
//       console.error('Error fetching report:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Generate Denial Report
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Date Range Filters */}
//         <Grid item xs={12}>
//           <TextField
//             label="Posted Date"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>
//         {/* <Grid item xs={6}>
//           <TextField
//             label="End Date"
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid> */}

//         {/* Provider Filters */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Provider</InputLabel>
//             <Select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
//               {providers.map((provider) => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Supervising Provider</InputLabel>
//             <Select value={selectedSupervisingProvider} onChange={(e) => setSelectedSupervisingProvider(e.target.value)}>
//               {providers.map((provider) => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Billing Provider</InputLabel>
//             <Select value={selectedBillingProvider} onChange={(e) => setSelectedBillingProvider(e.target.value)}>
//               {providers.map((provider) => (
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
//               {offices.map((office) => (
//                 <MenuItem key={office.id} value={office.id}>
//                   {office.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Appointment Profile</InputLabel>
//             <Select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)}>
//               {profiles.map((profile) => (
//                 <MenuItem key={profile.id} value={profile.id}>
//                   {profile.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Adjustment Reason Code</InputLabel>
//             <Select value={selectedAdjustmentCode} onChange={(e) => setSelectedAdjustmentCode(e.target.value)}>
//               {adjustmentReasonCodes.map((code) => (
//                 <MenuItem key={code.code} value={code.code}>
//                   {`${code.code}: ${code.description}`}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading}>
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//       {reportData.length > 0 && (
//         <Paper sx={{ mt: 4, p: 2 }}>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Adjustment Reason</TableCell>
//                   <TableCell>Patient</TableCell>
//                   <TableCell>Service Date</TableCell>
//                   <TableCell>Doctor</TableCell>
//                   <TableCell>Supervising Provider</TableCell>
//                   <TableCell>Billing Provider</TableCell>
//                   <TableCell>Office</TableCell>
//                   <TableCell>Primary Insurance</TableCell>
//                   <TableCell>Code</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportData.map((row, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{row.id}</TableCell>
//                     <TableCell>{row.adjustment_reason}</TableCell>
//                     <TableCell>{row.patient}</TableCell>
//                     <TableCell>{row.posted_date}</TableCell>
//                     <TableCell>{row.doctor}</TableCell>
//                     <TableCell>{row.supervising_provider}</TableCell>
//                     <TableCell>{row.billing_provider}</TableCell>
//                     <TableCell>{row.office}</TableCell>
//                     <TableCell>{row.primary_insurance_name}</TableCell>
//                     <TableCell>{row.code}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default DenialReport;

// ---- report starts here ------

// // src/components/DenialReport.js
// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   TextField,
//   Grid,
//   Box,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import axios from 'axios';
// import { saveAs } from 'file-saver';


// // Adjustment Reason Codes
// const adjustmentReasonCodes = [
//   { code: '-3', description: 'Insurance Payment' },
//   { code: '-2', description: 'Patient Bad Debt Writeoff' },
//   { code: '-4', description: 'Insurance Bad Debt Writeoff' },
//   { code: '-1', description: 'Transfer Balance to Patient' },
//   { code: '0', description: 'Provider Discount' },
//   { code: '1', description: 'Deductible Amount' },
//   { code: '2', description: 'Coinsurance Amount' },
//   { code: '3', description: 'Co-payment Amount' },
//   { code: '4', description: 'Procedure code inconsistency with modifier.' },
// ];

// const DenialReport = () => {
//   const [startDate, setStartDate] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
//   const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [selectedAdjustmentCode, setSelectedAdjustmentCode] = useState('');
//   const [reportData, setReportData] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch doctors, offices, and profiles on load
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       const token = localStorage.getItem('access_token');
//       try {
//         const [doctorsRes, officesRes, profilesRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setDoctors(doctorsRes.data);
//         setOffices(officesRes.data);
//         setProfiles(profilesRes.data);
//       } catch (error) {
//         console.error('Error fetching filter data:', error);
//       }
//     };

//     fetchFilterData();
//   }, []);

//   const handleFetchData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await axios.get('http://localhost:4000/api/generate-denial-report', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           start_date: startDate,
//           doctor: selectedDoctor || undefined,
//           supervising_provider: selectedSupervisingProvider || undefined,
//           billing_provider: selectedBillingProvider || undefined,
//           office: selectedOffice || undefined,
//           profile: selectedProfile || undefined,
//           adjustment_code: selectedAdjustmentCode || undefined,
//         },
//       });

//       setReportData(response.data);
//     } catch (error) {
//       setError('Failed to fetch the report.');
//       console.error('Error fetching report:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadCSV = () => {
//     const headers = [
//       'ID',
//       'Adjustment Reason',
//       'Appointment ID',
//       'Patient ID',
//       'Service Date',
//       'Doctor',
//       'Supervising Provider',
//       'Billing Provider',
//       'Office',
//       'Primary Insurance',
//       'Primary ID',
//       'Secondary Insurance',
//       'Secondary ID',
//       'Code',
//       'Procedure Type',
//     ];

//     // Helper function to escape special characters
//     const escapeCSV = (value) => {
//       if (typeof value === 'string') {
//         // Wrap the value in quotes if it contains commas or newlines
//         if (value.includes(',') || value.includes('\n') || value.includes('"')) {
//           value = `"${value.replace(/"/g, '""')}"`; // Escape double quotes
//         }
//       }
//       return value;
//     };

//     const rows = reportData.map((row) => [
//       row.id,
//       escapeCSV(row.adjustment_reason),
//       escapeCSV(row.appointment_id),
//       escapeCSV(row.patient_id),
//       escapeCSV(row.posted_date),
//       escapeCSV(row.doctor),
//       escapeCSV(row.supervising_provider),
//       escapeCSV(row.billing_provider),
//       escapeCSV(row.office),
//       escapeCSV(row.primary_insurance_name),
//       escapeCSV(row.primary_insurance_id_number),
//       escapeCSV(row.secondary_insurance_name),
//       escapeCSV(row.secondary_insurance_id_number),
//       escapeCSV(row.code),
//       escapeCSV(row.procedure_type),
//     ]);

//     // Build CSV content
//     let csvContent = headers.join(',') + '\n';
//     rows.forEach((rowArray) => {
//       csvContent += rowArray.join(',') + '\n';
//     });

//     // Create a Blob and trigger the download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'Denial_Report.csv');
//   };



//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Generate Denial Report
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Date Filter */}
//         <Grid item xs={12}>
//           <TextField
//             label="Posted Date"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>

//         {/* Doctor Filter */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Doctor</InputLabel>
//             <Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Supervising Provider Filter */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Supervising Provider</InputLabel>
//             <Select
//               value={selectedSupervisingProvider}
//               onChange={(e) => setSelectedSupervisingProvider(e.target.value)}
//             >
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Billing Provider Filter */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Billing Provider</InputLabel>
//             <Select
//               value={selectedBillingProvider}
//               onChange={(e) => setSelectedBillingProvider(e.target.value)}
//             >
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Office Filter */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Office</InputLabel>
//             <Select value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
//               {offices.map((office) => (
//                 <MenuItem key={office.id} value={office.id}>
//                   {office.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Appointment Profile Filter */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Appointment Profile</InputLabel>
//             <Select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)}>
//               {profiles.map((profile) => (
//                 <MenuItem key={profile.id} value={profile.id}>
//                   {profile.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Adjustment Reason Code Filter */}
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Adjustment Reason Code</InputLabel>
//             <Select
//               value={selectedAdjustmentCode}
//               onChange={(e) => setSelectedAdjustmentCode(e.target.value)}
//             >
//               {adjustmentReasonCodes.map((code) => (
//                 <MenuItem key={code.code} value={code.code}>
//                   {`${code.code}: ${code.description}`}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading}>
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//       {reportData.length > 0 && (
//         <Paper sx={{ mt: 4, p: 2 }}>
//           <TableContainer sx={{ overflowX: 'auto', maxHeight: '600px', maxWidth: '1200px' }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Adjustment Reason</TableCell>
//                   <TableCell>Appointment ID</TableCell>
//                   <TableCell>Patient</TableCell>
//                   <TableCell>Service Date</TableCell>
//                   <TableCell>Doctor</TableCell>
//                   <TableCell>Supervising Provider</TableCell>
//                   <TableCell>Billing Provider</TableCell>
//                   <TableCell>Office</TableCell>
//                   <TableCell>Primary Insurance</TableCell>
//                   <TableCell>Primary ID</TableCell>
//                   <TableCell>Secondary Insurance</TableCell>
//                   <TableCell>Secondary ID</TableCell>
//                   <TableCell>Code</TableCell>
//                   <TableCell>Procedure Type</TableCell>

//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportData.map((row) => (
//                   <TableRow key={row.id}>
//                     <TableCell>{row.id}</TableCell>
//                     <TableCell>{row.adjustment_reason}</TableCell>
//                     <TableCell>{row.appointment_id}</TableCell>
//                     <TableCell>{row.patient_id}</TableCell>
//                     <TableCell>{row.posted_date}</TableCell>
//                     <TableCell>{row.doctor}</TableCell>
//                     <TableCell>{row.supervising_provider}</TableCell>
//                     <TableCell>{row.billing_provider}</TableCell>
//                     <TableCell>{row.office}</TableCell>
//                     <TableCell>{row.primary_insurance_name}</TableCell>
//                     <TableCell>{row.primary_insurance_id_number}</TableCell>
//                     <TableCell>{row.secondary_insurance_name}</TableCell>
//                     <TableCell>{row.secondary_insurance_id_number}</TableCell>
//                     <TableCell>{row.code}</TableCell>
//                     <TableCell>{row.procedure_type}</TableCell>

//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Box mt={2}>
//             <Button variant="contained" color="primary" onClick={downloadCSV}>
//               Download CSV
//             </Button>
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default DenialReport;

// frontend/src/components/DenialReport.js
// Below code works fantastically ------------
// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   TextField,
//   Grid,
//   Box,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import axios from 'axios';
// import { saveAs } from 'file-saver';

// // Adjustment Reason Codes
// const adjustmentReasonCodes = [
//   { code: '-3', description: 'Insurance Payment' },
//   { code: '-2', description: 'Patient Bad Debt Writeoff' },
//   { code: '-4', description: 'Insurance Bad Debt Writeoff' },
//   { code: '-1', description: 'Transfer Balance to Patient' },
//   { code: '0', description: 'Provider Discount' },
//   { code: '1', description: 'Deductible Amount' },
//   { code: '2', description: 'Coinsurance Amount' },
//   { code: '3', description: 'Co-payment Amount' },
//   { code: '4', description: 'Procedure code inconsistency with modifier.' },
// ];

// const DenialReport = () => {
//   // State Variables
//   const [startDate, setStartDate] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
//   const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [selectedAdjustmentCode, setSelectedAdjustmentCode] = useState('');

//   const [reportData, setReportData] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);

//   // Pagination State Variables
//   const [nextUrl, setNextUrl] = useState(null);
//   const [hasNextPage, setHasNextPage] = useState(false);

//   // Loading and Error States
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch doctors, offices, and profiles on component mount
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         setError('Access token not found. Please log in.');
//         return;
//       }
//       try {
//         const [doctorsRes, officesRes, profilesRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setDoctors(doctorsRes.data);
//         setOffices(officesRes.data);
//         setProfiles(profilesRes.data);
//       } catch (error) {
//         console.error('Error fetching filter data:', error);
//         setError('Failed to fetch filter data.');
//       }
//     };

//     fetchFilterData();
//   }, []);

//   // Function to fetch Denial Report data
//   const handleFetchData = async (isLoadMore = false) => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       setError('Access token not found. Please log in.');
//       return;
//     }

//     // Set loading states
//     if (isLoadMore) {
//       setLoadingMore(true);
//     } else {
//       setLoading(true);
//       setReportData([]);      // Clear previous data on initial fetch
//       setNextUrl(null);       // Reset nextUrl
//       setHasNextPage(false);  // Reset hasNextPage
//     }

//     setError('');

//     try {
//       // Prepare parameters based on whether it's a load more request
//       const params = isLoadMore ? { next: nextUrl } : {
//         start_date: startDate,
//         doctor: selectedDoctor || undefined,
//         supervising_provider: selectedSupervisingProvider || undefined,
//         billing_provider: selectedBillingProvider || undefined,
//         office: selectedOffice || undefined,
//         profile: selectedProfile || undefined,
//         adjustment_code: selectedAdjustmentCode || undefined,
//       };

//       console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);

//       const response = await axios.get('http://localhost:4000/api/generate-denial-report', {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       console.log('Backend Response:', response.data);

//       const { data, nextUrl: newNextUrl, hasNextPage: newHasNextPage } = response.data;

//       if (isLoadMore) {
//         setReportData((prevData) => [...prevData, ...data]);
//       } else {
//         setReportData(data);
//       }

//       setNextUrl(newNextUrl);
//       setHasNextPage(newHasNextPage);
//     } catch (error) {
//       console.error('Error fetching report:', error);
//       setError('Failed to fetch the report.');
//     } finally {
//       if (isLoadMore) {
//         setLoadingMore(false);
//       } else {
//         setLoading(false);
//       }
//     }
//   };

//   // Function to clear all filters and report data
//   const clearFilters = () => {
//     setStartDate('');
//     setSelectedDoctor('');
//     setSelectedSupervisingProvider('');
//     setSelectedBillingProvider('');
//     setSelectedOffice('');
//     setSelectedProfile('');
//     setSelectedAdjustmentCode('');
//     setReportData([]);
//     setNextUrl(null);
//     setHasNextPage(false);
//     setError('');
//   };

//   // Function to download the report as CSV
//   const downloadCSV = () => {
//     if (reportData.length === 0) {
//       setError('No data available to download.');
//       return;
//     }

//     const headers = [
//       'ID',
//       'Adjustment Reason',
//       'Appointment ID',
//       'Patient ID',
//       'Service Date',
//       'Doctor',
//       'Supervising Provider',
//       'Billing Provider',
//       'Office',
//       'Primary Insurance',
//       'Primary ID',
//       'Secondary Insurance',
//       'Secondary ID',
//       'Code',
//       'Procedure Type',
//     ];

//     // Helper function to escape special characters
//     const escapeCSV = (value) => {
//       if (typeof value === 'string') {
//         // Wrap the value in quotes if it contains commas, newlines, or quotes
//         if (value.includes(',') || value.includes('\n') || value.includes('"')) {
//           value = `"${value.replace(/"/g, '""')}"`; // Escape double quotes
//         }
//       }
//       return value;
//     };

//     const rows = reportData.map((row) => [
//       row.id,
//       escapeCSV(row.adjustment_reason),
//       escapeCSV(row.appointment_id),
//       escapeCSV(row.patient_id),
//       escapeCSV(row.posted_date),
//       escapeCSV(row.doctor),
//       escapeCSV(row.supervising_provider),
//       escapeCSV(row.billing_provider),
//       escapeCSV(row.office),
//       escapeCSV(row.primary_insurance_name),
//       escapeCSV(row.primary_insurance_id_number),
//       escapeCSV(row.secondary_insurance_name),
//       escapeCSV(row.secondary_insurance_id_number),
//       escapeCSV(row.code),
//       escapeCSV(row.procedure_type),
//     ]);

//     // Build CSV content
//     let csvContent = headers.join(',') + '\n';
//     rows.forEach((rowArray) => {
//       csvContent += rowArray.join(',') + '\n';
//     });

//     // Create a Blob and trigger the download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'Denial_Report.csv');
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Generate Denial Report
//       </Typography>

//       {/* Display Error Alert */}
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {/* Filters */}
//       <Grid container spacing={2}>
//         {/* Posted Date Filter */}
//         <Grid item xs={12} sm={6} md={4}>
//           <TextField
//             label="Posted Date"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>

// {/* Doctor Filter */}
// <Grid item xs={12} sm={6} md={4}>
//   <FormControl fullWidth>
//     <InputLabel>Doctor</InputLabel>
//     <Select
//       value={selectedDoctor}
//       onChange={(e) => setSelectedDoctor(e.target.value)}
//       label="Doctor"
//     >
//       <MenuItem value="">
//         <em>All</em>
//       </MenuItem>
//       {doctors.map((doctor) => (
//         <MenuItem key={doctor.id} value={doctor.id}>
//           {doctor.first_name} {doctor.last_name}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// </Grid>

// {/* Supervising Provider Filter */}
// <Grid item xs={12} sm={6} md={4}>
//   <FormControl fullWidth>
//     <InputLabel>Supervising Provider</InputLabel>
//     <Select
//       value={selectedSupervisingProvider}
//       onChange={(e) => setSelectedSupervisingProvider(e.target.value)}
//       label="Supervising Provider"
//     >
//       <MenuItem value="">
//         <em>All</em>
//       </MenuItem>
//       {doctors.map((doctor) => (
//         <MenuItem key={doctor.id} value={doctor.id}>
//           {doctor.first_name} {doctor.last_name}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// </Grid>

// {/* Billing Provider Filter */}
// <Grid item xs={12} sm={6} md={4}>
//   <FormControl fullWidth>
//     <InputLabel>Billing Provider</InputLabel>
//     <Select
//       value={selectedBillingProvider}
//       onChange={(e) => setSelectedBillingProvider(e.target.value)}
//       label="Billing Provider"
//     >
//       <MenuItem value="">
//         <em>All</em>
//       </MenuItem>
//       {doctors.map((doctor) => (
//         <MenuItem key={doctor.id} value={doctor.id}>
//           {doctor.first_name} {doctor.last_name}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// </Grid>

// {/* Office Filter */}
// <Grid item xs={12} sm={6} md={4}>
//   <FormControl fullWidth>
//     <InputLabel>Office</InputLabel>
//     <Select
//       value={selectedOffice}
//       onChange={(e) => setSelectedOffice(e.target.value)}
//       label="Office"
//     >
//       <MenuItem value="">
//         <em>All</em>
//       </MenuItem>
//       {offices.map((office) => (
//         <MenuItem key={office.id} value={office.id}>
//           {office.name}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// </Grid>

//         {/* Appointment Profile Filter */}
//         <Grid item xs={12} sm={6} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Appointment Profile</InputLabel>
//             <Select
//               value={selectedProfile}
//               onChange={(e) => setSelectedProfile(e.target.value)}
//               label="Appointment Profile"
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {profiles.map((profile) => (
//                 <MenuItem key={profile.id} value={profile.id}>
//                   {profile.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Adjustment Reason Code Filter */}
//         <Grid item xs={12} sm={6} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Adjustment Reason Code</InputLabel>
//             <Select
//               value={selectedAdjustmentCode}
//               onChange={(e) => setSelectedAdjustmentCode(e.target.value)}
//               label="Adjustment Reason Code"
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {adjustmentReasonCodes.map((code) => (
//                 <MenuItem key={code.code} value={code.code}>
//                   {`${code.code}: ${code.description}`}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       {/* Action Buttons */}
//       <Box mt={3} display="flex" gap={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleFetchData(false)}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
//         </Button>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={clearFilters}
//           disabled={loading || loadingMore}
//         >
//           Clear Filters
//         </Button>
//       </Box>

//       {/* Error Alert */}
//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//       {/* Report Table */}
//       {reportData.length > 0 && (
//         <Paper sx={{ mt: 4, p: 2 }}>
//           <TableContainer sx={{ overflowX: 'auto', maxHeight: 600, maxWidth: 1200 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Adjustment Reason</TableCell>
//                   <TableCell>Appointment ID</TableCell>
//                   <TableCell>Patient ID</TableCell>
                  // <TableCell>Service Date</TableCell>
                  // <TableCell>Doctor</TableCell>
                  // <TableCell>Supervising Provider</TableCell>
                  // <TableCell>Billing Provider</TableCell>
                  // <TableCell>Office</TableCell>
                  // <TableCell>Primary Insurance</TableCell>
                  // <TableCell>Primary ID</TableCell>
                  // <TableCell>Secondary Insurance</TableCell>
                  // <TableCell>Secondary ID</TableCell>
                  // <TableCell>Code</TableCell>
                  // <TableCell>Procedure Type</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportData.map((row) => (
//                   <TableRow key={row.id}>
//                     <TableCell>{row.id}</TableCell>
//                     <TableCell>{row.adjustment_reason}</TableCell>
//                     <TableCell>{row.appointment_id}</TableCell>
//                     <TableCell>{row.patient_id}</TableCell>
                    // <TableCell>{new Date(row.posted_date).toLocaleString()}</TableCell>
                    // <TableCell>{row.doctor}</TableCell>
                    // <TableCell>{row.supervising_provider}</TableCell>
                    // <TableCell>{row.billing_provider}</TableCell>
                    // <TableCell>{row.office}</TableCell>
                    // <TableCell>{row.primary_insurance_name}</TableCell>
                    // <TableCell>{row.primary_insurance_id_number}</TableCell>
                    // <TableCell>{row.secondary_insurance_name}</TableCell>
                    // <TableCell>{row.secondary_insurance_id_number}</TableCell>
                    // <TableCell>{row.code}</TableCell>
                    // <TableCell>{row.procedure_type}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Action Buttons for Download and Load More */}
//           <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={downloadCSV}
//               disabled={loading || loadingMore}
//             >
//               Download CSV
//             </Button>

//             {/* Load More Button */}
//             {hasNextPage && (
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => handleFetchData(true)}
//                 disabled={loadingMore}
//               >
//                 {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
//               </Button>
//             )}
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default DenialReport;


import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';

// Adjustment Reason Codes
const adjustmentReasonCodes = [
  { code: '-3', description: 'Insurance Payment' },
  { code: '-2', description: 'Patient Bad Debt Writeoff' },
  { code: '-4', description: 'Insurance Bad Debt Writeoff' },
  { code: '-1', description: 'Transfer Balance to Patient' },
  { code: '0', description: 'Provider Discount' },
  { code: '1', description: 'Deductible Amount' },
  { code: '2', description: 'Coinsurance Amount' },
  { code: '3', description: 'Co-payment Amount' },
  { code: '4', description: 'Procedure code inconsistency with modifier.' },
];

const DenialReport = () => {
  // State Variables
  const [startDate, setStartDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
  const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedAdjustmentCode, setSelectedAdjustmentCode] = useState('');

  const [reportData, setReportData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [offices, setOffices] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // Pagination State Variables
  const [nextUrl, setNextUrl] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Loading and Error States
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // Fetch doctors, offices, and profiles on component mount
  useEffect(() => {
    const fetchFilterData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Access token not found. Please log in.');
        return;
      }
      try {
        const [doctorsRes, officesRes, profilesRes] = await Promise.all([
          axios.get('https://drchronos-report.onrender.com/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://drchronos-report.onrender.com/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://drchronos-report.onrender.com/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDoctors(doctorsRes.data);
        setOffices(officesRes.data);
        setProfiles(profilesRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        setError('Failed to fetch filter data.');
      }
    };

    fetchFilterData();
  }, []);

  // Function to fetch Denial Report data
  const handleFetchData = async (isLoadMore = false) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Access token not found. Please log in.');
      return;
    }

    // Set loading states
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setReportData([]);      // Clear previous data on initial fetch
      setNextUrl(null);       // Reset nextUrl
      setHasNextPage(false);  // Reset hasNextPage
    }

    setError('');

    try {
      // Prepare parameters
      const params = {
        next: isLoadMore ? nextUrl : undefined,
        start_date: !isLoadMore ? startDate : undefined,
        doctor: selectedDoctor || undefined,
        supervising_provider: selectedSupervisingProvider || undefined,
        billing_provider: selectedBillingProvider || undefined,
        office: selectedOffice || undefined,
        profile: selectedProfile || undefined,
        adjustment_code: selectedAdjustmentCode || undefined,
      };

      console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);

      const response = await axios.get('https://drchronos-report.onrender.com/api/generate-denial-report', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log('Backend Response:', response.data);

      const { data, nextUrl: newNextUrl, hasNextPage: newHasNextPage } = response.data;

      if (isLoadMore) {
        setReportData((prevData) => [...prevData, ...data]);
      } else {
        setReportData(data);
      }

      setNextUrl(newNextUrl);
      setHasNextPage(newHasNextPage);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch the report.');
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Function to clear all filters and report data
  const clearFilters = () => {
    setStartDate('');
    setSelectedDoctor('');
    setSelectedSupervisingProvider('');
    setSelectedBillingProvider('');
    setSelectedOffice('');
    setSelectedProfile('');
    setSelectedAdjustmentCode('');
    setReportData([]);
    setNextUrl(null);
    setHasNextPage(false);
    setError('');
  };

  // Function to download the report as CSV
  const downloadCSV = () => {
    if (reportData.length === 0) {
      setError('No data available to download.');
      return;
    }

    const headers = [
      'ID',
      'Adjustment Reason',
      'Appointment ID',
      'Patient Name',
      'Posted Date',
      'Doctor',
      'Supervising Provider',
      'Billing Provider',
      'Office',
      'Primary Insurance',
      'Primary ID',
      'Secondary Insurance',
      'Secondary ID',
      'Code',
      'Procedure Type',
    ];

    // Helper function to escape special characters
    const escapeCSV = (value) => {
      if (typeof value === 'string') {
        // Wrap the value in quotes if it contains commas, newlines, or quotes
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value.replace(/"/g, '""')}"`; // Escape double quotes
        }
      }
      return value;
    };

    const rows = reportData.map((row) => [
      row.id,
      escapeCSV(row.adjustment_reason),
      escapeCSV(row.appointment_id),
      escapeCSV(row.patient_name),
      escapeCSV(row.posted_date),
      escapeCSV(row.doctor),
      escapeCSV(row.supervising_provider),
      escapeCSV(row.billing_provider),
      escapeCSV(row.office),
      escapeCSV(row.primary_insurance_name),
      escapeCSV(row.primary_insurance_id),
      escapeCSV(row.secondary_insurance_name),
      escapeCSV(row.secondary_insurance_id),
      escapeCSV(row.code),
      escapeCSV(row.procedure_type),
    ]);

    // Build CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach((rowArray) => {
      csvContent += rowArray.join(',') + '\n';
    });

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Denial_Report.csv');
  };

  return (
    <Box sx={{p: 3, width:'100%', overflow: 'hidden'  }}>
      <Typography variant="h4" gutterBottom>
        Generate Denial Report
      </Typography>

      {/* Display Error Alert */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters */}
      <Grid container spacing={2}>
        {/* Posted Date Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Posted Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>

        {/* Doctor Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              label="Doctor"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.first_name} {doctor.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Supervising Provider Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Supervising Provider</InputLabel>
            <Select
              value={selectedSupervisingProvider}
              onChange={(e) => setSelectedSupervisingProvider(e.target.value)}
              label="Supervising Provider"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.first_name} {doctor.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Billing Provider Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Billing Provider</InputLabel>
            <Select
              value={selectedBillingProvider}
              onChange={(e) => setSelectedBillingProvider(e.target.value)}
              label="Billing Provider"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.first_name} {doctor.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Office Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Office</InputLabel>
            <Select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              label="Office"
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

        {/* Adjustment Reason Code Filter */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Adjustment Reason Code</InputLabel>
            <Select
              value={selectedAdjustmentCode}
              onChange={(e) => setSelectedAdjustmentCode(e.target.value)}
              label="Adjustment Reason Code"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {adjustmentReasonCodes.map((code) => (
                <MenuItem key={code.code} value={code.code}>
                  {`${code.code}: ${code.description}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
      </Grid>

      {/* Action Buttons */}
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleFetchData(false)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Report'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={clearFilters}
          disabled={loading || loadingMore}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Error Alert */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* Report Table */}
      {reportData.length > 0 && (
        <Paper sx={{ width: '100%', mt: 1, p:1,overflow: 'hidden', border: '1px solid #ccc', borderRadius: '10px',}}>
          <TableContainer sx={{ maxHeight: 600, overflowX: 'auto', mt: 1  }}>
            <Table stickyHeader>
              <TableHead >
                <TableRow>
                  <TableCell>ID</TableCell>
                  {/* <TableCell>Adjustment Reason</TableCell> */}
                  <TableCell>Appointment ID</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Supervising Provider</TableCell>
                  <TableCell>Billing Provider</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Primary Insurance</TableCell>
                  <TableCell>Primary ID</TableCell>
                  <TableCell>Secondary Insurance</TableCell>
                  <TableCell>Secondary ID</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Procedure Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    {/* <TableCell>{row.adjustment_reason}</TableCell> */}
                    <TableCell>{row.appointment_id}</TableCell>
                    <TableCell>{row.patient_name}</TableCell>
                    <TableCell>{new Date(row.posted_date).toLocaleString()}</TableCell>
                    <TableCell>{row.doctor}</TableCell>
                    <TableCell>{row.supervising_provider}</TableCell>
                    <TableCell>{row.billing_provider}</TableCell>
                    <TableCell>{row.office}</TableCell>
                    <TableCell>{row.primary_insurance_name}</TableCell>
                    <TableCell>{row.primary_insurance_id_number}</TableCell>
                    <TableCell>{row.secondary_insurance_name}</TableCell>
                    <TableCell>{row.secondary_insurance_id_number}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.procedure_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Buttons for Download and Load More */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={downloadCSV}
              disabled={loading || loadingMore}
            >
              Download CSV
            </Button>

            {/* Load More Button */}
            {hasNextPage && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleFetchData(true)}
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

export default DenialReport;
