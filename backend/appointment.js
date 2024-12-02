const express = require('express');
const axios = require('axios');
const qs = require('qs'); 
const {
  getDoctorById,
  getOfficeById,
  fetchPatientsInBatches,
  dataCache,
} = require('./dataCache.js');
const router = express.Router();

// Existing helper function to fetch a single page of data
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
      fetchSinglePage(
        'https://app.drchrono.com/api/appointment_profiles',
        token
      ),
    ]);

    dataCache.doctors = Object.fromEntries(
      (doctorsData.results || []).map((doc) => [
        doc.id,
        { first_name: doc.first_name, last_name: doc.last_name },
      ])
    );
    dataCache.offices = Object.fromEntries(
      (officesData.results || []).map((office) => [
        office.id,
        { name: office.name },
      ])
    );
    dataCache.profiles = Object.fromEntries(
      (profilesData.results || []).map((profile) => [
        profile.id,
        { name: profile.name },
      ])
    );

    console.log('Bulk data loaded and cached.');
  } else {
    console.log('Using cached data for doctors, offices, and profiles.');
  }
};

// Helper function to wait for a specified time
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Route to fetch and process appointments
router.get('/appointments', async (req, res) => {
  const {
    start_date,
    end_date,
    doctor,
    supervising_provider,
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

  if (!start_date || !end_date) {
    console.error('Start date and/or end date is missing.');
    return res.status(400).json({
      message: 'Start date and end date must be provided.',
    });
  }

  try {
    // Load cached data if not already loaded
    await loadData(token);

    const baseApiUrl = 'https://app.drchrono.com/api/appointments_list';

    // Initial POST request to get the total number of pages and first page data
    const initialParams = {
      date_range: `${start_date}/${end_date}`,
      page_size: 1000,
      page: 1,
      verbose: true,
    };

    if (doctor) {
      initialParams.doctor = doctor;
      console.log(`Filtering appointments by doctor: ${doctor}`);
    }

    if (office) {
      initialParams.office = office;
      console.log(`Filtering appointments by office: ${office}`);
    }

    console.log(
      `Making initial POST request to ${baseApiUrl} with params:`,
      initialParams
    );

    // Serialize the query parameters
    const initialQueryString = qs.stringify(initialParams, {
      addQueryPrefix: true,
    });

    // Make initial POST request to get total pages and first page data
    let initialResponse = await axios.post(
      `${baseApiUrl}${initialQueryString}`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(`Successfully received initial response from POST request.`);
    console.log(`Initial response data:`, initialResponse.data);

    // Poll the API until the status is 'Complete' for the initial request
    let status = initialResponse.data.status;
    let currentUUID = initialResponse.data.uuid;
    let attempts = 0;
    const maxAttempts = 10; // Adjust as needed
    const interval = 60000; // 5 seconds

    while (status !== 'Complete' && attempts < maxAttempts) {
      console.log(
        `Status is '${status}'. Waiting for ${interval / 1000} seconds...`
      );
      await sleep(interval);
      initialResponse = await axios.get(baseApiUrl, {
        headers: { Authorization: `Bearer ${token}` },
        params: { uuid: currentUUID },
      });
      status = initialResponse.data.status;
      console.log(`Polled API. Current status: '${status}'.`);
      attempts += 1;
    }

    if (status !== 'Complete') {
      console.error('Data retrieval did not complete in time.');
      return res.status(500).json({
        message: 'Data retrieval did not complete in time.',
      });
    }

    // Extract total_pages from initial response
    const total_pages = initialResponse.data.pagination.pages;

    // Collect results from the initial response
    let allResults = initialResponse.data.results || [];

    // Function to fetch data for a single page
    const fetchPageData = async (pageNumber) => {
      // Make POST request for the specific page
      const pageParams = {
        date_range: `${start_date}/${end_date}`,
        page_size: 1000,
        page: pageNumber,
        verbose: true,
      };

      if (doctor) {
        pageParams.doctor = doctor;
      }

      if (office) {
        pageParams.office = office;
      }

      console.log(`Making POST request for page ${pageNumber}:`, pageParams);

      // Serialize the query parameters
      const pageQueryString = qs.stringify(pageParams, { addQueryPrefix: true });

      let pageResponse = await axios.post(
        `${baseApiUrl}${pageQueryString}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Received response for page ${pageNumber}:`, pageResponse.data);

      let pageStatus = pageResponse.data.status;
      let pageUUID = pageResponse.data.uuid;
      let pageAttempts = 0;

      // Poll until the status is 'Complete' for this page
      while (pageStatus !== 'Complete' && pageAttempts < maxAttempts) {
        console.log(
          `Page ${pageNumber} status is '${pageStatus}'. Waiting for ${interval / 1000
          } seconds...`
        );
        await sleep(interval);
        pageResponse = await axios.get(baseApiUrl, {
          headers: { Authorization: `Bearer ${token}` },
          params: { uuid: pageUUID },
        });
        pageStatus = pageResponse.data.status;
        console.log(
          `Polled API for page ${pageNumber}. Current status: '${pageStatus}'.`
        );
        pageAttempts += 1;
      }

      if (pageStatus !== 'Complete') {
        throw new Error(
          `Data retrieval for page ${pageNumber} did not complete in time.`
        );
      }

      return pageResponse.data.results;
    };

    // Fetch data for pages starting from page 2
    for (let pageNumber = 2; pageNumber <= total_pages; pageNumber++) {
      try {
        const pageResults = await fetchPageData(pageNumber);
        allResults = allResults.concat(pageResults);
      } catch (error) {
        console.error(`Failed to fetch data for page ${pageNumber}:`, error.message);
        return res.status(500).json({
          message: `Failed to fetch data for page ${pageNumber}`,
          error: error.message,
        });
      }
    }

    // Check if 'allResults' is an array
    if (!Array.isArray(allResults)) {
      console.error('Results is not an array:', allResults);
      return res.status(500).json({
        message: 'Invalid data format received from API.',
        error: 'Results is not an array.',
      });
    }

    const patientIds = allResults
      .map((appointment) => appointment.patient)
      .filter(Boolean); // Exclude undefined or null IDs

    // Step 2: Fetch patient data in batches and cache it
    await fetchPatientsInBatches(patientIds, token);


    // Process each appointment
    const appointments = await Promise.all(
      allResults.map(async (appointment) => {
        const doctorData = appointment.doctor
          ? await getDoctorById(appointment.doctor, token)
          : { first_name: '', last_name: '' };

        const supervisingProviderData = appointment.supervising_provider
          ? await getDoctorById(appointment.supervising_provider, token)
          : { first_name: '', last_name: '' };

        const officeData = appointment.office
          ? await getOfficeById(appointment.office, token)
          : { name: '' };

        const patientData = appointment.patient
          ? dataCache.patients[appointment.patient] || { first_name: ' ', last_name: ' ' }
          : { first_name: ' ', last_name: ' ' };


        return {
          appointment_id: appointment.id,
          scheduled_time: appointment.scheduled_time || '',
          doctorName: `${doctorData.first_name} ${doctorData.last_name}`.trim(),
          doctor_id: appointment.doctor,
          supervisingProvider: `${supervisingProviderData.first_name} ${supervisingProviderData.last_name}`.trim(),
          supervising_provider_id: appointment.supervising_provider,
          officeName: officeData.name,
          office_id: appointment.office,
          patient_name: `${patientData.first_name} ${patientData.last_name}`.trim(),
          patient_id: appointment.patient,
          profile: dataCache.profiles[appointment.profile]?.name || '',
          profile_id: appointment.profile,
          duration: appointment.duration || '',
          primary_insurer_name: appointment.primary_insurer_name || '',
          primary_insurance_id_number:
            appointment.primary_insurance_id_number || '',
          secondary_insurer_name: appointment.secondary_insurer_name || '',
          secondary_insurance_id_number:
            appointment.secondary_insurance_id_number || '',
        };
      })
    );

    // Apply additional filters locally
    const filteredAppointments = appointments.filter((appt) => {
      let match = true;

      if (supervising_provider) {
        match =
          match &&
          appt.supervising_provider_id === parseInt(supervising_provider);
      }
      if (profile) {
        match = match && appt.profile_id === parseInt(profile);
      }

      return match;
    });

    console.log(
      `Processed Appointments - Total Count: ${filteredAppointments.length}`
    );

    res.json({
      data: filteredAppointments,
      totalPages: total_pages,
    });
  } catch (error) {
    console.error(
      'Failed to fetch appointments:',
      error.response?.data || error.message
    );
    res.status(500).json({
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
});

module.exports = router;
