const express = require("express");
const { getLocationData } = require("./api/mapbox");
const { getCurrentWeatherData } = require("./api/currentweather");
const { getFutureWeatherData } = require("./api/future-weather");
const app = express();
const PORT = 4001;

app.get("/", async ({ query }, res) => {
  const { latitude, longitude } = query;
  const [location, currentWeather, futureWeather] = await Promise.all([
    getLocationData(latitude, longitude),
    getCurrentWeatherData(latitude, longitude),
    getFutureWeatherData(latitude, longitude),
  ]);
  res.status(200).send({
    location,
    currentWeather: currentWeather ? currentWeather.data : null,
    futureWeather: futureWeather ? futureWeather.data : null,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
