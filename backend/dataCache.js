const axios = require('axios'); // Use CommonJS require syntax

// In-memory cache object
const dataCache = {
  doctors: {},
  offices: {},
  profiles: {},
  patients: {},
};

// Function to fetch doctor data by ID, with caching
const getDoctorById = async (id, token) => {
  if (dataCache.doctors[id]) {
    console.log(`Using cached doctor for ID: ${id}`);
    return dataCache.doctors[id];
  }

  try {
    const response = await axios.get(`https://app.drchrono.com/api/doctors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const doctorData = { first_name: response.data.first_name, last_name: response.data.last_name };
    dataCache.doctors[id] = doctorData; // Store in cache
    return doctorData;
  } catch (error) {
    console.error(`Error fetching doctor ID ${id}:`, error.message);
    throw error;
  }
};

// Function to fetch office data by ID, with caching
const getOfficeById = async (id, token) => {
  if (dataCache.offices[id]) {
    console.log(`Using cached office for ID: ${id}`);
    return dataCache.offices[id];
  }

  try {
    const response = await axios.get(`https://app.drchrono.com/api/offices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const officeData = { name: response.data.name };
    dataCache.offices[id] = officeData; // Store in cache
    return officeData;
  } catch (error) {
    console.error(`Error fetching office ID ${id}:`, error.message);
    throw error;
  }
};

// Function to fetch patient data by ID, with caching
const getPatientById = async (id, token) => {
  if (dataCache.patients[id]) {
    console.log(`Using cached patient for ID: ${id}`);
    return dataCache.patients[id];
  }

  try {
    console.log(`Fetching patient data for ID: ${id}`);
    const response = await axios.get(`https://app.drchrono.com/api/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const patientData = { first_name: response.data.first_name, last_name: response.data.last_name };
    dataCache.patients[id] = patientData; // Store in cache
    return patientData;
  } catch (error) {
    console.error(`Error fetching patient ID ${id}:`, error.message);
    throw error;
  }
};

// Function to fetch appointment profile data by ID, with caching
const getProfileById = async (id, token) => {
  if (dataCache.profiles[id]) {
    console.log(`Using cached profile for ID: ${id}`);
    return dataCache.profiles[id];
  }

  try {
    console.log(`Fetching profile data for ID: ${id}`);
    const response = await axios.get(`https://app.drchrono.com/api/appointment_profiles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const profileData = { name: response.data.name };
    dataCache.profiles[id] = profileData; // Store in cache
    return profileData;
  } catch (error) {
    console.error(`Error fetching profile ID ${id}:`, error.message);
    throw error;
  }
};

// Export the cache and functions
module.exports = {
  dataCache,
  getDoctorById,
  getOfficeById,
  getPatientById,
  getProfileById, // Export profile caching function
};
