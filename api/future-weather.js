const { v4: uuidv4 } = require("uuid");
const { withCache } = require("../utils/with-cache");
const {
  celsiusToFahrenheit,
  centimetersToInches,
  msToMph,
} = require("../utils/unit-conversion");
const { axiosWeatherbit } = require("../utils/axios-weatherbit");

/**
 *
 * @param {number} latitude
 * @param {number} longitude
 */
const getFutureWeatherData = async (latitude, longitude) =>
  withCache(`future-weather-${latitude},${longitude}`, async () => {
    const response = await axiosWeatherbit.get(
      `forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}`
    );

    return transformData(response.data);
  });

/**
 * Creates dummy data for testing
 * @returns
 */
const createFutureWeatherData = () => {
  const weatherData = {
    data: [],
  };

  for (let i = 1; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const day = {
      app_max_temp: Math.random() * 40,
      app_min_temp: Math.random() * 40,
      cloud_cover: Math.floor(Math.random() * 100),
      clouds_hi: Math.floor(Math.random() * 100),
      clouds_low: Math.floor(Math.random() * 100),
      clouds_mid: Math.floor(Math.random() * 100),
      date: date.toISOString().slice(0, 10),
      dew_point: Math.random() * 40,
      high_temp: Math.random() * 40,
      low_temp: Math.random() * 40,
      max_temp: Math.random() * 40,
      min_temp: Math.random() * 40,
      moon_phase: Math.random(),
      moon_phase_lunation: Math.random(),
      moonrise_ts: Math.floor(Date.now() / 1000),
      moonset_ts: Math.floor(Date.now() / 1000),
      ozone: Math.random() * 1000,
      pop: Math.floor(Math.random() * 100),
      precip: Math.random() * 10,
      pressure: Math.random() * 1000,
      relative_humidity: Math.floor(Math.random() * 100),
      snow: Math.random() * 10,
      snow_depth: Math.random() * 10,
      sunrise_ts: Math.floor(Date.now() / 1000),
      sunset_ts: Math.floor(Date.now() / 1000),
      temp: Math.random() * 40,
      ts: Math.floor(Date.now() / 1000),
      uv: Math.floor(Math.random() * 10),
      valid_date: date.toISOString().slice(0, 10),
      vis: Math.random() * 10,
      weather: {
        description: "random weather description",
      },
      wind_dir: Math.floor(Math.random() * 360),
      wind_cdir_full: "random wind direction",
      wind_gust_spd: Math.random() * 40,
      wind_spd: Math.random() * 40,
    };

    weatherData.data.push(day);
  }

  return transformData(weatherData);
};

/**
 * Transforms the weather data from the Weatherbit API into a more readable format
 * @param {*} weatherData
 * @returns
 */
const transformData = (weatherData) => {
  return weatherData.data.map((day) => {
    return {
      ...day,
      id: uuidv4(),
      app_max_temp: `${Math.round(celsiusToFahrenheit(day.app_max_temp))} °F`,
      app_min_temp: `${Math.round(celsiusToFahrenheit(day.app_min_temp))} °F`,
      cloud_cover: `${day.clouds}%`,
      clouds_hi: `${day.clouds_hi}%`,
      clouds_low: `${day.clouds_low}%`,
      clouds_mid: `${day.clouds_mid}%`,
      date: day.datetime,
      dew_point: `${Math.round(celsiusToFahrenheit(day.dewpt))} °F`,
      high_temp: `${Math.round(celsiusToFahrenheit(day.high_temp))} °F`,
      low_temp: `${Math.round(celsiusToFahrenheit(day.low_temp))} °F`,
      max_temp: `${Math.round(celsiusToFahrenheit(day.max_temp))} °F`,
      min_temp: `${Math.round(celsiusToFahrenheit(day.min_temp))} °F`,
      moon_phase: `${day.moon_phase}`,
      moon_phase_lunation: `${day.moon_phase_lunation}`,
      moonrise: new Date(day.moonrise_ts * 1000).toLocaleString(),
      moonset: new Date(day.moonset_ts * 1000).toLocaleString(),
      ozone: `${day.ozone} DU`,
      pop: `${day.pop}%`,
      precip: `${centimetersToInches(day.precip)} in`,
      pressure: `${day.pres} mb`,
      relative_humidity: `${day.rh}%`,
      snowfall: `${centimetersToInches(day.snow)} in`,
      snow_depth: `${centimetersToInches(day.snow_depth)} in`,
      sunrise: new Date(day.sunrise_ts * 1000).toLocaleString(),
      sunset: new Date(day.sunset_ts * 1000).toLocaleString(),
      temp: `${Math.round(celsiusToFahrenheit(day.temp))} °F`,
      unix_timestamp: day.ts,
      timestamp: new Date(day.ts * 1000).toLocaleString(),
      uv_index: `${day.uv}`,
      valid_date: day.valid_date,
      visibility: `${centimetersToInches(day.vis)} in`,
      weather_description: day.weather ? day.weather.description : "N/A",
      wind_direction: `${day.wind_dir}° ${day.wind_cdir_full}`,
      wind_gust_speed: `${Math.round(msToMph(day.wind_gust_spd))} mph`,
      wind_speed: `${Math.round(msToMph(day.wind_spd))} mph`,
    };
  });
};

module.exports = {
  getFutureWeatherData,
  createFutureWeatherData,
};
