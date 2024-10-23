import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const DataCacheContext = createContext();

// Create a provider component
export const DataCacheProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Access token not found.');
        setLoading(false);
        return;
      }

      try {
        const [doctorsRes, officesRes] = await Promise.all([
          axios.get('https://drchronos-report.onrender.com/api/doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://drchronos-report.onrender.com/api/offices', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctors(doctorsRes.data);
        setOffices(officesRes.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <DataCacheContext.Provider value={{ doctors, offices, loading }}>
      {children}
    </DataCacheContext.Provider>
  );
};
