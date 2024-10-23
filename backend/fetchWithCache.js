const axios = require('axios');
const cache = require('./cache'); // Import the shared cache

async function fetchWithCache(url, token) {
  const cachedData = cache.get(url);
  if (cachedData) {
    console.log(`Using cached data for ${url}`);
    return cachedData;
  }

  console.log(`Fetching fresh data from ${url}`);
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  cache.set(url, response.data); // Store data in cache
  return response.data;
}

module.exports = fetchWithCache;
