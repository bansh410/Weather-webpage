// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.OPENWEATHER_API_KEY;

app.use(express.static('public'));

app.get('/api/weather', async (req, res) => {
  const { location } = req.query;

  try {
    // First, get current weather
    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: location,
        appid: apiKey,
        units: 'metric',
      },
    });

    const coord = weatherRes.data.coord;

    // Now, get forecast
    const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        lat: coord.lat,
        lon: coord.lon,
        appid: apiKey,
        units: 'metric',
      },
    });

    res.json({
      current: weatherRes.data,
      forecast: forecastRes.data,
    });
  } catch (err) {
    res.status(400).json({ error: err.response?.data?.message || "Failed to fetch weather data." });
  }
});

app.listen(PORT, () => {
  console.log(`🌦️ Server running at http://localhost:${PORT}`);
});
