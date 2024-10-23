// import React, { useState } from 'react';
// import { Button, TextField, Grid, Box } from '@mui/material';
// import axios from 'axios';

// const AppointmentReport = () => {
//   const [sinceDate, setSinceDate] = useState('');

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       console.log('Access Token from LocalStorage:', token); // Debugging token

//       if (!token) {
//         console.error('No token found in localStorage!');
//         return;
//       }

//       // Make the GET request
//       const response = await axios.get('http://localhost:4000/api/generate-appointments-report', {
//         params: { since: sinceDate },
//         headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
//         responseType: 'blob', // Important for downloading file
//       });

//       // Log the response for debugging
//       console.log('Axios Response:', response);

//       // If the response is successful, handle the file download
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'appointments_report.csv'); // Set the desired file name
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link); // Cleanup after download
//     } catch (error) {
//       console.error('Error downloading report:', error); // Error handling
//     }
//   };

//   return (
//     <Box p={3}>
//       <h1>Generate Appointment Report</h1>
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
//           Download Appointment Report
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default AppointmentReport;
// ---------------------------------- 10/21/24
// import React, { useState, useEffect } from 'react';
// import { Button, TextField, Grid, Box, Select, MenuItem, InputLabel, FormControl, CircularProgress, Typography } from '@mui/material';
// import axios from 'axios';

// const AppointmentReport = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedSupervisingPhysician, setSelectedSupervisingPhysician] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');

//   // Fetch doctors and offices on page load
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         console.error('Access token not found.');
//         return;
//       }

//       try {
//         const [doctorsRes, officesRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setDoctors(doctorsRes.data);
//         setOffices(officesRes.data);
//       } catch (error) {
//         console.error('Error fetching initial data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Fetch appointments when button is clicked
//   const fetchAppointments = async () => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       console.error('Access token not found.');
//       return;
//     }

//     try {
//       const response = await axios.get('http://localhost:4000/api/appointments', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { start_date: startDate, end_date: endDate, doctor: selectedDoctor },
//       });

//       setAppointments(response.data);
//       setFilteredAppointments(response.data); // Initialize with fetched data
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const clearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//     setSelectedDoctor('');
//     setSelectedSupervisingPhysician('');
//     setSelectedOffice('');
//     setFilteredAppointments(appointments); // Reset filtered appointments
//   };



//   // // Apply client-side filters
//   // const applyFilters = () => {
//   //   const filtered = appointments.filter((appointment) => {
//   //     const matchesDoctor = selectedDoctor ? appointment.doctor === parseInt(selectedDoctor) : true;
//   //     const matchesSupervisingPhysician = selectedSupervisingPhysician
//   //       ? appointment.supervising_provider === parseInt(selectedSupervisingPhysician)
//   //       : true;
//   //     const matchesOffice = selectedOffice ? appointment.office === parseInt(selectedOffice) : true;
//   //     const matchesDate =
//   //       (!startDate || new Date(appointment.scheduled_time) >= new Date(startDate)) &&
//   //       (!endDate || new Date(appointment.scheduled_time) <= new Date(endDate));

//   //     return matchesDoctor && matchesSupervisingPhysician && matchesOffice && matchesDate;
//   //   });

//   //   setFilteredAppointments(filtered);
//   // };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box p={3}>
//       <Typography variant="h4">Generate Appointment Report</Typography>
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
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Supervising Physician</InputLabel>
//             <Select
//               value={selectedSupervisingPhysician}
//               onChange={(e) => setSelectedSupervisingPhysician(e.target.value)}
//             >
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
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
//       </Grid>
//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={fetchAppointments}>
//           Fetch Appointments
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={clearFilters}>
//           Clear Filters
//         </Button>
//       </Box>
//       <Box mt={3}>
//         <Typography variant="h6">Filtered Appointments</Typography>
//         <pre>{JSON.stringify(filteredAppointments, null, 2)}</pre>
//       </Box>
//     </Box>
//   );
// };

// export default AppointmentReport;


/// ----------------- This code below works ------------------

// import React, { useState, useEffect } from 'react';
// import { Button, TextField, Grid, Box, Select, MenuItem, InputLabel, FormControl, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// import axios from 'axios';
// import { saveAs } from 'file-saver'; // Import file-saver library to save files

// const AppointmentReport = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedSupervisingPhysician, setSelectedSupervisingPhysician] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         console.error('Access token not found.');
//         return;
//       }

//       try {
//         const [doctorsRes, officesRes] = await Promise.all([
//           axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setDoctors(doctorsRes.data);
//         setOffices(officesRes.data);
//       } catch (error) {
//         console.error('Error fetching initial data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const clearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//     setSelectedDoctor('');
//     setSelectedSupervisingPhysician('');
//     setSelectedOffice('');
//     setFilteredAppointments(appointments); // Reset filtered appointments
//   };


//   const fetchAppointments = async () => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       console.error('Access token not found.');
//       return;
//     }

//     try {
//       const response = await axios.get('http://localhost:4000/api/appointments', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { start_date: startDate, end_date: endDate, doctor: selectedDoctor },
//       });

//       setAppointments(response.data);
//       setFilteredAppointments(response.data); // Initialize with fetched data
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const downloadCSV = () => {
//     const headers = [
//       'Appointment ID',
//       'Scheduled Date',
//       'Scheduled Time',
//       'Doctor',
//       'Supervising Provider',
//       'Billing Provider',
//       'Office',
//       'Profile',
//       'Duration',
//       'Primary Insurer Name',
//       'Primary Insurance ID',
//       'Secondary Insurer Name',
//       'Secondary Insurance ID'
//     ];

//     const rows = filteredAppointments.map((appointment) => [
//       appointment.appointment_id,
//       new Date(appointment.scheduled_time).toLocaleString(),
//       appointment.doctor,
//       appointment.supervising_provider,
//       appointment.billing_provider,
//       appointment.office,
//       appointment.profile,
//       appointment.duration,
//       appointment.primary_insurer_name,
//       appointment.primary_insurance_id_number,
//       appointment.secondary_insurer_name,
//       appointment.secondary_insurance_id_number,
//     ]);

//     // Combine headers and rows into a CSV string
//     let csvContent = headers.join(',') + '\n';
//     rows.forEach((rowArray) => {
//       csvContent += rowArray.join(',') + '\n';
//     });

//     // Convert CSV string into a blob and download it
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'appointment_report.csv');
//   };



//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{
//       p: 3
//     }}>
//       <Typography variant="h4" sx={{ mb: 2 }}>Appointment Report</Typography>
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
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Doctor</InputLabel>
//             <Select value={selectedDoctor} label="Doctor" onChange={(e) => setSelectedDoctor(e.target.value)}>
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Supervising Physician</InputLabel>
//             <Select
//               value={selectedSupervisingPhysician}
//               label="Supervising Physician"
//               onChange={(e) => setSelectedSupervisingPhysician(e.target.value)}
//             >
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Office</InputLabel>
//             <Select value={selectedOffice} label="Office" onChange={(e) => setSelectedOffice(e.target.value)}>
//               {offices.map((office) => (
//                 <MenuItem key={office.id} value={office.id}>
//                   {office.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>
//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={fetchAppointments} sx={{ mr: 1 }}>
//           Fetch Appointments
//         </Button>
//         <Button variant="contained" color="secondary" onClick={clearFilters}>
//           Clear
//         </Button>
//       </Box>
//       <Box mt={3}>
//         {/* <Typography variant="h6">Filtered Appointments</Typography> */}
//         {filteredAppointments.length > 0 ? (
//           <>
//             <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Appointment ID</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Scheduled Time</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Doctor</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Supervising Provider</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Billing Provider</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Office</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Appointment Profile</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Duration</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Primary Insurer Name</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Primary Insurance ID</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Secondary Insurer Name</TableCell>
//                     <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }}>Secondary Insurance ID</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredAppointments.map((appointment) => (
//                     <TableRow key={appointment.id}>
//                       <TableCell>{appointment.appointment_id}</TableCell>
//                       <TableCell>{new Date(appointment.scheduled_time).toLocaleString()}</TableCell>
//                       <TableCell>{appointment.doctor}</TableCell>
//                       <TableCell>{appointment.supervising_provider}</TableCell>
//                       <TableCell>{appointment.billing_provider}</TableCell>
//                       <TableCell>{appointment.office}</TableCell>
//                       <TableCell>{appointment.profile}</TableCell>
//                       <TableCell>{appointment.duration}</TableCell>
//                       <TableCell>{appointment.primary_insurer_name}</TableCell>
//                       <TableCell>{appointment.primary_insurance_id_number}</TableCell>
//                       <TableCell>{appointment.secondary_insurer_name}</TableCell>
//                       <TableCell>{appointment.secondary_insurance_id_number}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <Box mt={2}>
//               <Button variant="contained" color="secondary" onClick={downloadCSV}>
//                 Download CSV
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <Typography></Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default AppointmentReport;

// src/components/AppointmentReport.js
// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   TextField,
//   Grid,
//   Box,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from '@mui/material';
// import axios from 'axios';
// import { saveAs } from 'file-saver';

// const AppointmentReport = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [selectedOffice, setSelectedOffice] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [offices, setOffices] = useState([]);
//   const [profiles, setProfiles] = useState([]);


//   // Fetch initial data for doctors and offices
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         console.error('Access token not found.');
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
//         console.error('Error fetching initial data:', error);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Fetch appointments with filters applied
//   const fetchAppointments = async () => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       console.error('Access token not found.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.get('http://localhost:4000/api/appointments', {
//         headers: { Authorization: `Bearer ${token}` },
//         // params: { start_date: startDate, end_date: endDate, doctor: selectedDoctor, supervising_provider: selectedSupervisingProvider, profile: selectedProfile },
//         params: { start_date: startDate, end_date: endDate},

//       });

//       setAppointments(response.data);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//     setSelectedDoctor('');
//     setSelectedOffice('');
//     setAppointments([]);
//   };

//   // Download the appointments report as CSV
//   const downloadCSV = () => {
//     const headers = [
//       'Appointment ID',
//       'Scheduled Time',
//       'Doctor',
//       'Office',
//       'Patient Name',
//       'Profile',
//       'Duration',
//       'Primary Insurer Name',
//       'Primary Insurance ID',
//       'Secondary Insurer Name',
//       'Secondary Insurance ID',
//     ];

//     const rows = appointments.map((appointment) => [
//       appointment.appointment_id,
//       new Date(appointment.scheduled_time).toLocaleString(),
//       appointment.doctorName || '',
//       appointment.officeName || '',
//       appointment.patient_name || '',
//       appointment.patient_id || '',
//       appointment.profile || '',
//       appointment.duration || '',
//       appointment.primary_insurer_name || '',
//       appointment.primary_insurance_id_number || '',
//       appointment.secondary_insurer_name || '',
//       appointment.secondary_insurance_id_number || '',
//     ]);

//     let csvContent = headers.join(',') + '\n';
//     rows.forEach((rowArray) => {
//       csvContent += rowArray.join(',') + '\n';
//     });

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'appointment_report.csv');
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 2 }}>Appointment Report</Typography>

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

//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Doctor</InputLabel>
//             <Select
//               value={selectedDoctor}
//               onChange={(e) => setSelectedDoctor(e.target.value)}
//             >
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Office</InputLabel>
//             <Select
//               value={selectedOffice}
//               onChange={(e) => setSelectedOffice(e.target.value)}
//             >
//               {offices.map((office) => (
//                 <MenuItem key={office.id} value={office.id}>
//                   {office.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Supervising Provider</InputLabel>
//             <Select value={selectedSupervisingProvider} onChange={(e) => setSelectedSupervisingProvider(e.target.value)}>
//               {doctors.map((doctor) => (
//                 <MenuItem key={doctor.id} value={doctor.id}>
//                   {doctor.first_name} {doctor.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={6}>
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



//       <Box mt={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={fetchAppointments}
//           sx={{ mr: 1 }}
//         >
//           Fetch Appointments
//         </Button>
//         <Button variant="contained" color="secondary" onClick={clearFilters}>
//           Clear Filters
//         </Button>
//       </Box>

//       {appointments.length > 0 && (
//         <Box sx={{ mt: 4, p: 2 }}>
//           <TableContainer sx={{ overflowX: 'auto', maxHeight: '600px', maxWidth: '1200px' }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Appointment ID</TableCell>
//                   <TableCell>Scheduled Time</TableCell>
//                   <TableCell>Doctor</TableCell>
//                   <TableCell>Office</TableCell>
//                   <TableCell>Patient ID</TableCell>
//                   <TableCell>Profile</TableCell>
//                   <TableCell>Duration</TableCell>
//                   <TableCell>Primary Insurer Name</TableCell>
//                   <TableCell>Primary Insurance ID</TableCell>
//                   <TableCell>Secondary Insurer Name</TableCell>
//                   <TableCell>Secondary Insurance ID</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {appointments.map((appointment) => (
//                   <TableRow key={appointment.appointment_id}>
//                     <TableCell>{appointment.appointment_id}</TableCell>
//                     <TableCell>{new Date(appointment.scheduled_time).toLocaleString()}</TableCell>
//                     <TableCell>{appointment.doctorName}</TableCell>
//                     <TableCell>{appointment.officeName}</TableCell>
//                     <TableCell>{appointment.patient_id}</TableCell>
//                     <TableCell>{appointment.profile}</TableCell>
//                     <TableCell>{appointment.duration}</TableCell>
//                     <TableCell>{appointment.primary_insurer_name}</TableCell>
//                     <TableCell>{appointment.primary_insurance_id_number}</TableCell>
//                     <TableCell>{appointment.secondary_insurer_name}</TableCell>
//                     <TableCell>{appointment.secondary_insurance_id_number}</TableCell>
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
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AppointmentReport;

// frontend/src/components/AppointmentReport.js

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';

const AppointmentReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSupervisingProvider, setSelectedSupervisingProvider] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [offices, setOffices] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // Fetch initial data for doctors, offices, and profiles
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Access token not found.');
        setError('Access token not found. Please log in.');
        return;
      }
  
      try {
        const [doctorsRes, officesRes, profilesRes] = await Promise.all([
          axios.get('http://localhost:4000/api/doctors', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4000/api/offices', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4000/api/appointment_profiles', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
  
        setDoctors(doctorsRes.data);
        setOffices(officesRes.data);
        setProfiles(profilesRes.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to fetch initial data.');
      }
    };
  
    fetchInitialData();
  }, []);
  

  // Fetch appointments with filters applied
  const fetchAppointments = async (isLoadMore = false) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Access token not found.');
      setError('Access token not found. Please log in.');
      return;
    }
  
    // Set loading states
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setAppointments([]); // Clear previous data on initial fetch
      setNextUrl(null); // Reset nextUrl
    }
  
    setError('');
  
    try {
      const params = {
        next: isLoadMore ? nextUrl : undefined,
        start_date: !isLoadMore ? startDate : undefined,
        end_date: !isLoadMore ? endDate : undefined,
        doctor: selectedDoctor || undefined,
        supervising_provider: selectedSupervisingProvider || undefined,
        office: selectedOffice || undefined,
        profile: selectedProfile || undefined,
      };
  
      console.log(`Fetching data. Load More: ${isLoadMore}, Params:`, params);
  
      const response = await axios.get('http://localhost:4000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
  
      console.log('Backend Response:', response.data);
  
      const { data, nextUrl: newNextUrl, hasNextPage } = response.data;
  
      if (isLoadMore) {
        setAppointments((prevAppointments) => [...prevAppointments, ...data]);
      } else {
        setAppointments(data);
      }
  
      setNextUrl(hasNextPage ? newNextUrl : null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments.');
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };
  

  // Clear all filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedDoctor('');
    setSelectedSupervisingProvider('');
    setSelectedOffice('');
    setSelectedProfile('');
    setAppointments([]);
    setNextUrl(null);
    setError('');
  };


  // Download the appointments report as CSV
  const downloadCSV = () => {
    if (appointments.length === 0) {
      setError('No appointments to download.');
      return;
    }

    const headers = [
      'Appointment ID',
      'Scheduled Time',
      'Doctor',
      'Supervising Provider',
      'Office',
      'Patient ID',
      'Profile',
      'Duration',
      'Primary Insurer Name',
      'Primary Insurance ID',
      'Secondary Insurer Name',
      'Secondary Insurance ID',
    ];

    const rows = appointments.map((appointment) => [
      appointment.appointment_id,
      new Date(appointment.scheduled_time).toLocaleString(),
      appointment.doctorName || '',
      appointment.supervisingProvider || '',
      appointment.officeName || '',
      appointment.patient_name || '',
      appointment.profile || '',
      appointment.duration || '',
      appointment.primary_insurer_name || '',
      appointment.primary_insurance_id_number || '',
      appointment.secondary_insurer_name || '',
      appointment.secondary_insurance_id_number || '',
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach((rowArray) => {
      csvContent += rowArray.map(item => `"${item}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'appointment_report.csv');
  };

  return (
    <Box sx={{ p: 3, width:'100%', overflow: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Appointment Report</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
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

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>

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

      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchAppointments(false)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Appointments'}
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

      {appointments.length > 0 && (
        <Box sx={{ width: '100%', mt: 1, p:1,overflow: 'hidden', border: '1px solid #ccc', borderRadius: '10px', }}>
          <TableContainer component={Paper} sx={{ maxHeight: 600, overflowX: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Appointment ID</TableCell>
                  <TableCell>Scheduled Time</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Supervising Provider</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Profile</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Primary Insurer Name</TableCell>
                  <TableCell>Primary Insurance ID</TableCell>
                  <TableCell>Secondary Insurer Name</TableCell>
                  <TableCell>Secondary Insurance ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.appointment_id}>
                    <TableCell>{appointment.appointment_id}</TableCell>
                    <TableCell>{new Date(appointment.scheduled_time).toLocaleString()}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.supervisingProvider}</TableCell>
                    <TableCell>{appointment.officeName}</TableCell>
                    <TableCell>{appointment.patient_name}</TableCell>
                    <TableCell>{appointment.profile}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>{appointment.primary_insurer_name}</TableCell>
                    <TableCell>{appointment.primary_insurance_id_number}</TableCell>
                    <TableCell>{appointment.secondary_insurer_name}</TableCell>
                    <TableCell>{appointment.secondary_insurance_id_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={downloadCSV}
              disabled={loading || loadingMore}
            >
              Download CSV
            </Button>
            {nextUrl && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => fetchAppointments(true)}
                disabled={loadingMore}
              >
                {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentReport;
