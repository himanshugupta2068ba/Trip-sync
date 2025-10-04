// utils/geocoder.js
const axios = require('axios');

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const res = await axios.get(url, {
      headers: {
        // Be polite and identify your app. Replace with a real contact email/domain.
        'User-Agent': 'Wonderlust/1.0 (himanshugupta2068ba@gmail.com)',
        'Accept-Language': 'en'
      },
      timeout: 8000
    });
    if (res.data && res.data.length > 0) {
      const top = res.data[0];
      return {
        lat: parseFloat(top.lat),
        lng: parseFloat(top.lon),
        display_name: top.display_name
      };
    }
    return null;
  } catch (err) {
    console.error('Geocode error:', err.message);
    return null;
  }
}

module.exports = { geocodeAddress };
