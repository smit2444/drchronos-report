// // src/components/ChargeReport.js
// import React, { useState } from 'react';
// import { Button, TextField, Grid, Box } from '@mui/material';
// import axios from 'axios';

// const ChargeReport = () => {
//   const [sinceDate, setSinceDate] = useState('');

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem('access_token');

//       if (!token) {
//         console.error('No token found in localStorage!');
//         return;
//       }

//       const response = await axios.get('http://localhost:4000/api/generate-charge-report', {
//         params: { since: sinceDate },
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'charge_report.csv');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading Charge Report:', error);
//     }
//   };

//   return (
//     <Box p={3}>
//       <h1>Generate Charge Report</h1>
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
//           Download Charge Report
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ChargeReport;

// src/components/ChargeReport.js
// src/components/ChargeReport.js
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
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from '@mui/material';
// import axios from 'axios';
// import { saveAs } from 'file-saver';

// const ChargeReport = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState('');
//   const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
//   const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');

//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [providers, setProviders] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);

//   const headers = [
//     'Service Date',
//     'Last Billed Date',
//     'Total Billed',
//     'Provider',
//     'Supervising Provider',
//     'Billing Provider',
//     'Office',
//     'Patient',
//     'Primary Insurance',
//     'Secondary Insurance',
//     'Code',
//     'Procedure Type',
//   ];

//   // Fetch Providers, Offices, and Profiles on component load
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) return console.error('Access token not found');

//       try {
//         const [providerRes, officeRes, profileRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setProviders(providerRes.data);
//         setOffices(officeRes.data);
//         setProfiles(profileRes.data);
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
//       if (!token) throw new Error('No access token found in local storage!');

//       const response = await axios.get('http://localhost:4000/api/generate-charge-report', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           start_date: startDate,
//           end_date: endDate,
//           // provider: selectedProvider,
//           // supervising_provider: selectedSupervisingProvider,
//           // billing_provider: selectedBillingProvider,
//           // office: selectedOffice,
//           // profile: selectedProfile,
//         },
//       });

//       setReportData(response.data);
//     } catch (err) {
//       setError('Failed to fetch report data.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//     setSelectedProvider('');
//     setSelectedSupervisingProvider('');
//     setSelectedBillingProvider('');
//     setSelectedOffice('');
//     setSelectedProfile('');
//     setReportData([]);
//   };

//   const downloadCSV = () => {
//     let csvContent = headers.join(',') + '\n';
//     reportData.forEach((row) => {
//       const rowData = headers.map((header) =>
//         row[header.toLowerCase().replace(/ /g, '_')] || 'N/A'
//       );
//       csvContent += rowData.join(',') + '\n';
//     });

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'charge_report.csv');
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Generate Charge Report
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={6}>
//           <TextField
//             label="Start Date"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>

//         <Grid item xs={6}>
//           <TextField
//             label="End Date"
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>

//         {[{ label: 'Provider', value: selectedProvider, setValue: setSelectedProvider },
//           { label: 'Supervising Provider', value: selectedSupervisingProvider, setValue: setSelectedSupervisingProvider },
//           { label: 'Billing Provider', value: selectedBillingProvider, setValue: setSelectedBillingProvider }]
//           .map(({ label, value, setValue }) => (
//             <Grid item xs={12} key={label}>
//               <FormControl fullWidth>
//                 <InputLabel>{label}</InputLabel>
//                 <Select value={value} onChange={(e) => setValue(e.target.value)}>
//                   {providers.map((provider) => (
//                     <MenuItem key={provider.id} value={provider.id}>
//                       {provider.first_name} {provider.last_name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//           ))}

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
//       </Grid>

//       <Box mt={2} display="flex" gap={2}>
//         <Button variant="contained" color="primary" onClick={handleFetchData}>
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report Data'}
//         </Button>
//         <Button variant="contained" color="secondary" onClick={clearFilters}>
//           Clear Filters
//         </Button>
//         <Button variant="contained" color="primary" onClick={downloadCSV}>
//           Download CSV
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//       {reportData.length > 0 && (
//         <Paper sx={{ mt: 4, p: 2 }}>
//           <TableContainer sx={{ overflowX: 'auto', maxHeight: '600px', maxWidth: '1200px' }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Service Date</TableCell>
//                   <TableCell>Last Billed Date</TableCell>
//                   <TableCell>Updated Date</TableCell>
//                   <TableCell>Posted Date</TableCell>
//                   <TableCell>Total Billed</TableCell>
//                   <TableCell>Provider</TableCell>
//                   <TableCell>Supervising Provider</TableCell>
//                   <TableCell>Billing Provider</TableCell>
//                   <TableCell>Office</TableCell>
//                   <TableCell>Primary Insurance</TableCell>
//                   <TableCell>Primary ID</TableCell>
//                   <TableCell>Secondary Insurance</TableCell>
//                   <TableCell>Secondary ID</TableCell>
//                   <TableCell>Patient ID</TableCell>
//                   <TableCell>Code</TableCell>
//                   <TableCell>Procedure Type</TableCell>

//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportData.map((row) => (
//                   <TableRow key={row.id}>
//                     <TableCell>{row.service_date}</TableCell>
//                     <TableCell>{row.last_billed_date}</TableCell>
//                     <TableCell>{row.updated_at}</TableCell>
//                     <TableCell>{row.posted_date}</TableCell>
//                     <TableCell>{row.total_billed}</TableCell>
//                     <TableCell>{row.provider}</TableCell>
//                     <TableCell>{row.supervising_provider}</TableCell>
//                     <TableCell>{row.billing_provider}</TableCell>
//                     <TableCell>{row.office}</TableCell>
//                     <TableCell>{row.primary_insurance_name}</TableCell>
//                     <TableCell>{row.primary_insurance_id}</TableCell>
//                     <TableCell>{row.secondary_insurance_name}</TableCell>
//                     <TableCell>{row.secondary_insurance_id}</TableCell>
//                     <TableCell>{row.patient_id}</TableCell>
//                     <TableCell>{row.code}</TableCell>
//                     <TableCell>{row.procedure_type}</TableCell>

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

// export default ChargeReport;

// This Code below works great. We will keep this one as backup

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
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from '@mui/material';
// import axios from 'axios';
// import { saveAs } from 'file-saver';

// const ChargeReport = () => {
//   // Filter States
//   const [startDate, setStartDate] = useState('');
//   // const [endDate, setEndDate] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState('');
//   const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
//   const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');

//   // Report Data State
//   const [reportData, setReportData] = useState([]);

//   // Pagination State
//   const [nextUrl, setNextUrl] = useState(null);
//   const [hasNextPage, setHasNextPage] = useState(false);

//   // Loading and Error States
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState('');

//   // Filter Options State
//   const [providers, setProviders] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);

//   // Table Headers
//   const headers = [
//     'Service Date',
//     'Last Billed Date',
//     'Updated At',
//     'Posted Date',
//     'Total Billed',
//     'Provider',
//     'Supervising Provider',
//     'Billing Provider',
//     'Office',
//     'Primary Insurance',
//     'Primary ID',
//     'Secondary Insurance',
//     'Secondary ID',
//     'Patient ID',
//     'Appointment ID',
//     'Code',
//     'Procedure Type',
//   ];

//   // Fetch Providers, Offices, and Profiles on component load
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         setError('Access token not found. Please log in.');
//         return;
//       }

//       try {
//         const [providerRes, officeRes, profileRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setProviders(providerRes.data);
//         setOffices(officeRes.data);
//         setProfiles(profileRes.data);
//       } catch (error) {
//         console.error('Error fetching filter data:', error);
//         setError('Failed to fetch filter data.');
//       }
//     };

//     fetchFilterData();
//   }, []);

//   // Function to fetch Charge Report data
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
//         // end_date: endDate,
//         provider: selectedProvider || undefined,
//         supervising_provider: selectedSupervisingProvider || undefined,
//         billing_provider: selectedBillingProvider || undefined,
//         office: selectedOffice || undefined,
//         profile: selectedProfile || undefined,
//       };

//       console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);

//       const response = await axios.get('http://localhost:4000/api/generate-charge-report', {
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
//       console.error('Error fetching report data:', error);
//       setError('Failed to fetch report data.');
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
//     // setEndDate('');
//     setSelectedProvider('');
//     setSelectedSupervisingProvider('');
//     setSelectedBillingProvider('');
//     setSelectedOffice('');
//     setSelectedProfile('');
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
//       'Service Date',
//       'Last Billed Date',
//       'Updated At',
//       'Posted Date',
//       'Total Billed',
//       'Provider',
//       'Supervising Provider',
//       'Billing Provider',
//       'Office',
//       'Primary Insurance',
//       'Primary ID',
//       'Secondary Insurance',
//       'Secondary ID',
//       'Patient ID',
//       'Appointment ID',
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
//       row.service_date,
//       row.last_billed_date,
//       row.updated_at,
//       row.posted_date,
//       row.total_billed,
//       escapeCSV(row.provider),
//       escapeCSV(row.supervising_provider),
//       escapeCSV(row.billing_provider),
//       escapeCSV(row.office),
//       escapeCSV(row.primary_insurance_name),
//       escapeCSV(row.primary_insurance_id),
//       escapeCSV(row.secondary_insurance_name),
//       escapeCSV(row.secondary_insurance_id),
//       escapeCSV(row.patient_id),
//       escapeCSV(row.appointment_id),
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
//     saveAs(blob, 'Charge_Report.csv');
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Generate Charge Report
//       </Typography>

//       {/* Display Error Alert */}
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {/* Filters */}
//       <Grid container spacing={2}>
//         {/* Start Date Filter */}
//         <Grid item xs={6} sm={4}>
//           <TextField
//             label="Start Date"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid>

//         {/* End Date Filter */}
//         {/* <Grid item xs={6} sm={4}>
//           <TextField
//             label="End Date"
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//         </Grid> */}

//         {/* Provider Filter */}
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <InputLabel>Provider</InputLabel>
//             <Select
//               value={selectedProvider}
//               onChange={(e) => setSelectedProvider(e.target.value)}
//               label="Provider"
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {providers.map((provider) => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Supervising Provider Filter */}
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <InputLabel>Supervising Provider</InputLabel>
//             <Select
//               value={selectedSupervisingProvider}
//               onChange={(e) => setSelectedSupervisingProvider(e.target.value)}
//               label="Supervising Provider"
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {providers.map((provider) => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Billing Provider Filter */}
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <InputLabel>Billing Provider</InputLabel>
//             <Select
//               value={selectedBillingProvider}
//               onChange={(e) => setSelectedBillingProvider(e.target.value)}
//               label="Billing Provider"
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {providers.map((provider) => (
//                 <MenuItem key={provider.id} value={provider.id}>
//                   {provider.first_name} {provider.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Office Filter */}
//         <Grid item xs={12} sm={6} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Office</InputLabel>
//             <Select
//               value={selectedOffice}
//               onChange={(e) => setSelectedOffice(e.target.value)}
//               label="Office"
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {offices.map((office) => (
//                 <MenuItem key={office.id} value={office.id}>
//                   {office.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

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
//       </Grid>

//       {/* Action Buttons */}
//       <Box mt={3} display="flex" gap={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleFetchData(false)}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Fetch Report Data'}
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

//       {/* Report Table */}
//       {reportData.length > 0 && (
//         <Paper sx={{ mt: 4, p: 2 }}>
//           <TableContainer sx={{ overflowX: 'auto', maxHeight: 600 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Service Date</TableCell>
//                   <TableCell>Last Billed Date</TableCell>
//                   <TableCell>Updated At</TableCell>
//                   <TableCell>Posted Date</TableCell>
//                   <TableCell>Total Billed</TableCell>
//                   <TableCell>Provider</TableCell>
//                   <TableCell>Supervising Provider</TableCell>
//                   <TableCell>Billing Provider</TableCell>
//                   <TableCell>Office</TableCell>
//                   <TableCell>Primary Insurance</TableCell>
//                   <TableCell>Primary ID</TableCell>
//                   <TableCell>Secondary Insurance</TableCell>
//                   <TableCell>Secondary ID</TableCell>
//                   <TableCell>Patient Name</TableCell>
//                   <TableCell>Appointment ID</TableCell>
//                   <TableCell>Appointment Profile</TableCell>
//                   <TableCell>Code</TableCell>
//                   <TableCell>Procedure Type</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportData.map((row, index) => (
//                   <TableRow key={`${row.appointment_id}-${index}`}>
//                     <TableCell>{row.service_date}</TableCell>
//                     <TableCell>{row.last_billed_date}</TableCell>
//                     <TableCell>{row.updated_at}</TableCell>
//                     <TableCell>{row.posted_date}</TableCell>
//                     <TableCell>{row.total_billed}</TableCell>
//                     <TableCell>{row.provider}</TableCell>
//                     <TableCell>{row.supervising_provider}</TableCell>
//                     <TableCell>{row.billing_provider}</TableCell>
//                     <TableCell>{row.office}</TableCell>
//                     <TableCell>{row.primary_insurance_name}</TableCell>
//                     <TableCell>{row.primary_insurance_id}</TableCell>
//                     <TableCell>{row.secondary_insurance_name}</TableCell>
//                     <TableCell>{row.secondary_insurance_id}</TableCell>
//                     <TableCell>{row.patient_name}</TableCell>
//                     <TableCell>{row.appointment_id}</TableCell>
//                     <TableCell>{row.profile}</TableCell>
//                     <TableCell>{row.code}</TableCell>
//                     <TableCell>{row.procedure_type}</TableCell>
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

// export default ChargeReport;
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ChargeReport = () => {
  // Filter States
  const [startDate, setStartDate] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedSupervisingProvider, setSelectedSupervisingProvider] =
    useState('');
  const [selectedBillingProvider, setSelectedBillingProvider] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');

  // Report Data State
  const [reportData, setReportData] = useState([]);

  // Pagination State
  const [nextUrl, setNextUrl] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Loading and Error States
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // Filter Options State
  const [providers, setProviders] = useState([]);
  const [offices, setOffices] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // Fetch Providers, Offices, and Profiles on component load
  useEffect(() => {
    const fetchFilterData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Access token not found. Please log in.');
        return;
      }

      try {
        const [providerRes, officeRes, profileRes] = await Promise.all([
          axios.get('http://localhost:4000/api/doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:4000/api/offices', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:4000/api/appointment_profiles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProviders(providerRes.data);
        setOffices(officeRes.data);
        setProfiles(profileRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        setError('Failed to fetch filter data.');
      }
    };

    fetchFilterData();
  }, []);

  // Function to fetch Charge Report data
  // Function to fetch Charge Report data
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
    setReportData([]); // Clear previous data on initial fetch
    setNextUrl(null); // Reset nextUrl
    setHasNextPage(false); // Reset hasNextPage
  }

  setError('');

  try {
    // Prepare parameters
    const params = {
      next: isLoadMore ? nextUrl : undefined,
      start_date: !isLoadMore ? startDate : undefined,
      provider: selectedProvider || undefined,
      supervising_provider: selectedSupervisingProvider || undefined,
      billing_provider: selectedBillingProvider || undefined,
      office: selectedOffice || undefined,
      profile: selectedProfile || undefined,
    };

    console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);

    const response = await axios.get(
      'http://localhost:4000/api/generate-charge-report',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );

    console.log('Backend Response:', response.data);

    const {
      data,
      nextUrl: newNextUrl,
      hasNextPage: newHasNextPage,
    } = response.data;

    if (isLoadMore) {
      setReportData((prevData) => [...prevData, ...data]);
    } else {
      setReportData(data);
    }

    setNextUrl(newNextUrl);
    setHasNextPage(newHasNextPage);
  } catch (error) {
    console.error('Error fetching report data:', error);
    setError('Failed to fetch report data.');
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
    setSelectedProvider('');
    setSelectedSupervisingProvider('');
    setSelectedBillingProvider('');
    setSelectedOffice('');
    setSelectedProfile('');
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
      'Service Date',
      'Last Billed Date',
      'Updated At',
      'Posted Date',
      'Total Billed',
      'Provider',
      'Supervising Provider',
      'Billing Provider',
      'Office',
      'Primary Insurance',
      'Primary ID',
      'Secondary Insurance',
      'Secondary ID',
      'Patient Name',
      'Appointment ID',
      'Appointment Profile',
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
      row.service_date,
      row.last_billed_date,
      row.updated_at,
      row.posted_date,
      row.total_billed,
      escapeCSV(row.provider),
      escapeCSV(row.supervising_provider),
      escapeCSV(row.billing_provider),
      escapeCSV(row.office),
      escapeCSV(row.primary_insurance_name),
      escapeCSV(row.primary_insurance_id),
      escapeCSV(row.secondary_insurance_name),
      escapeCSV(row.secondary_insurance_id),
      escapeCSV(row.patient_name),
      escapeCSV(row.appointment_id),
      escapeCSV(row.profile),
      escapeCSV(row.code),
      escapeCSV(row.procedure_type),
    ]);

    // Build CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach((rowArray) => {
      csvContent += rowArray.join(',') + '\n';
    });

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'Charge_Report.csv');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Generate Charge Report
      </Typography>

      {/* Display Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Grid container spacing={2}>
        {/* Start Date Filter */}
        <Grid item xs={6} sm={4}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>

        {/* Provider Filter */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              label="Provider"
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
        <Grid item xs={12} sm={4}>
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
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Billing Provider Filter */}
        <Grid item xs={12} sm={4}>
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
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
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

        {/* Appointment Profile Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Appointment Profile</InputLabel>
            <Select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              label="Appointment Profile"
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

      {/* Action Buttons */}
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleFetchData(false)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Report Data'}
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

      {/* Report Table */}
      {reportData.length > 0 && (
        <Paper sx={{ width: '100%', mt: 1, p:1,overflow: 'hidden', border: '1px solid #ccc', borderRadius: '10px', }}>
          <TableContainer sx={{  maxHeight: 600, overflowX: 'auto', mt: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Last Billed Date</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Posted Date</TableCell>
                  <TableCell>Total Billed</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Supervising Provider</TableCell>
                  <TableCell>Billing Provider</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Primary Insurance</TableCell>
                  <TableCell>Primary ID</TableCell>
                  <TableCell>Secondary Insurance</TableCell>
                  <TableCell>Secondary ID</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Appointment ID</TableCell>
                  <TableCell>Appointment Profile</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Procedure Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((row, index) => (
                  <TableRow key={`${row.appointment_id}-${index}`}>
                    <TableCell>{row.service_date}</TableCell>
                    <TableCell>{row.last_billed_date}</TableCell>
                    <TableCell>{row.updated_at}</TableCell>
                    <TableCell>{row.posted_date}</TableCell>
                    <TableCell>{row.total_billed}</TableCell>
                    <TableCell>{row.provider}</TableCell>
                    <TableCell>{row.supervising_provider}</TableCell>
                    <TableCell>{row.billing_provider}</TableCell>
                    <TableCell>{row.office}</TableCell>
                    <TableCell>{row.primary_insurance_name}</TableCell>
                    <TableCell>{row.primary_insurance_id}</TableCell>
                    <TableCell>{row.secondary_insurance_name}</TableCell>
                    <TableCell>{row.secondary_insurance_id}</TableCell>
                    <TableCell>{row.patient_name}</TableCell>
                    <TableCell>{row.appointment_id}</TableCell>
                    <TableCell>{row.profile}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.procedure_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Buttons for Download and Load More */}
          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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

export default ChargeReport;
