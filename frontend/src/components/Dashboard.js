// src/components/Dashboard.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Box, CssBaseline, Divider, Paper } from '@mui/material';
import { Dashboard as DashboardIcon, BarChart, Assignment, Payment, Description } from '@mui/icons-material';
import AppointmentReport from './AppointmentReport';
import DenialReport from './DenialReport';
import PaymentAnalysisReport from './PaymentAnalysisReport';
import ChargeReport from './ChargeReport';
import { DataCacheProvider } from './DataCacheContext';


// Sidebar items with their corresponding icons
const reportItems = [
  { label: 'Appointment Report', icon: <Assignment />, component: <AppointmentReport /> },
  { label: 'Denial Report', icon: <Description />, component: <DenialReport /> },
  { label: 'Payment Analysis Report', icon: <Payment />, component: <PaymentAnalysisReport /> },
  { label: 'Charge Report', icon: <BarChart />, component: <ChargeReport /> },

];

const Dashboard = () => {
  const [activeReport, setActiveReport] = useState(reportItems[0].component); // Track the active report

  const handleReportChange = (component) => {
    setActiveReport(component);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Reports Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {reportItems.map((item, index) => (
            <ListItem button key={index} onClick={() => handleReportChange(item.component)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Paper sx={{
          p: 3, border: '1px solid #ccc', // Add border
          borderRadius: '4px',
          width: 'auto'
        }}>
          {activeReport}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;

// import React, { useState } from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   CssBaseline,
//   Divider,
//   Paper,
// } from '@mui/material';
// import { Dashboard as DashboardIcon, BarChart, Assignment, Payment, Description } from '@mui/icons-material';
// import AppointmentReport from './AppointmentReport';
// import DenialReport from './DenialReport';
// import PaymentAnalysisReport from './PaymentAnalysisReport';
// import ChargeReport from './ChargeReport';
// import { DataCacheProvider } from './DataCacheContext';

// // Sidebar items with their corresponding icons
// const reportItems = [
//   { label: 'Appointment Report', icon: <Assignment />, component: AppointmentReport },
//   { label: 'Denial Report', icon: <Description />, component: DenialReport },
//   { label: 'Payment Analysis Report', icon: <Payment />, component: PaymentAnalysisReport },
//   { label: 'Charge Report', icon: <BarChart />, component: ChargeReport },
// ];

// const Dashboard = () => {
//   const [activeReport, setActiveReport] = useState(reportItems[0].component); // Track the active report

//   const handleReportChange = (component) => {
//     setActiveReport(component);
//   };

//   const ActiveReportComponent = activeReport;

//   // Debugging: Check what ActiveReportComponent is
//   console.log('ActiveReportComponent:', ActiveReportComponent);

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />

//       {/* Top App Bar */}
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <Typography variant="h6" noWrap component="div">
//             Reports Dashboard
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: 240,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
//         }}
//       >
//         <Toolbar />
//         <Divider />
//         <List>
//           {reportItems.map((item, index) => (
//             <ListItem button key={index} onClick={() => handleReportChange(item.component)}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.label} />
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <DataCacheProvider>
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Toolbar />
//           <Paper
//             sx={{
//               p: 3,
//               border: '1px solid #ccc', // Add border
//               borderRadius: '4px',
//             }}
//           >
//             {ActiveReportComponent ? (
//               <ActiveReportComponent />
//             ) : (
//               <Typography variant="h6">No Report Selected</Typography>
//             )}
//           </Paper>
//         </Box>
//       </DataCacheProvider>
//     </Box>
//   );
// };

// export default Dashboard;
