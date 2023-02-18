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
const getCurrentWeatherData = async (latitude, longitude) =>
  withCache(`current-weather-${latitude},${longitude}`, async () => {
    const response = await axiosWeatherbit.get(
      `current?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}`
    );
    return transformData(response.data.data[0]);
  });

/**
 * Creates dummy weather data for testing purposes
 * @returns
 */
const createDummyWeatherData = () => {
  const data = {
    app_temp: Math.floor(Math.random() * (30 - -30 + 1)) + -30,
    aqi: Math.floor(Math.random() * (500 - 1 + 1)) + 1,
    clouds: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
    datetime: new Date().toISOString(),
    dewpt: Math.floor(Math.random() * (30 - -30 + 1)) + -30,
    dhi: Math.floor(Math.random() * (1000 - 0 + 1)) + 0,
    dni: Math.floor(Math.random() * (1000 - 0 + 1)) + 0,
    elev_angle: Math.floor(Math.random() * (90 - -90 + 1)) + -90,
    ghi: Math.floor(Math.random() * (1000 - 0 + 1)) + 0,
    gust: Math.random() * (30 - 0) + 0,
    ob_time: new Date().toLocaleString(),
    pod: Math.random() < 0.5 ? "n" : "d",
    precip: Math.random() * (10 - 0) + 0,
    pres: Math.floor(Math.random() * (1100 - 900 + 1)) + 900,
    rh: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
    slp: Math.random() * (1100 - 900) + 900,
    snow: Math.random() * (10 - 0) + 0,
    solar_rad: Math.floor(Math.random() * (1500 - 0 + 1)) + 0,
    sources: ["gfs", "cmc", "icon", "nam", "rap"],
    state_code: "CA",
    station: "KAAA",
    sunrise: "06:00",
    sunset: "18:00",
    temp: Math.floor(Math.random() * (30 - -30 + 1)) + -30,
    timezone: "America/Los_Angeles",
    ts: Math.floor(new Date().getTime() / 1000),
    uv: Math.random() * (20 - 0) + 0,
    vis: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
    weather: {
      icon: "c01d",
      description: "clear sky",
      code: 800,
    },
    wind_cdir: "NW",
    wind_cdir_full: "northwest",
    wind_dir: Math.floor(Math.random() * (360 - 0 + 1)) + 0,
    wind_spd: Math.random() * (30 - 0) + 0,
  };

  return transformData(data);
};

/**
 * Transforms the weather data from the Weatherbit API into a more readable format
 * @param {*} weatherData
 * @returns
 */
const transformData = (weatherData) => {
  const result = {};
  result["feels_like"] = `${Math.round(
    celsiusToFahrenheit(weatherData.app_temp)
  )} °F`;
  result["air_quality_index"] = weatherData.aqi;
  result["cloud_cover"] = `${weatherData.clouds}%`;
  result["date_time"] = weatherData.datetime;
  result["dew_point"] = `${Math.round(
    celsiusToFahrenheit(weatherData.dewpt)
  )} °F`;
  result["direct_horizontal_irradiance"] = weatherData.dhi;
  result["direct_normal_irradiance"] = weatherData.dni;
  result["elevation_angle"] = `${weatherData.elev_angle}°`;
  result["global_horizontal_irradiance"] = weatherData.ghi;
  result["max_wind_gust_speed"] = `${msToMph(weatherData.gust)} mph`;
  result["observation_time"] = weatherData.ob_time;
  result["part_of_day"] = weatherData.pod === "n" ? "Night" : "Day";
  result["precipitation"] = `${centimetersToInches(weatherData.precip)} in`;
  result["pressure"] = `${weatherData.pres} hPa`;
  result["relative_humidity"] = `${weatherData.rh}%`;
  result["sea_level_pressure"] = `${weatherData.slp} hPa`;
  result["snowfall"] = `${centimetersToInches(weatherData.snow)} in`;
  result["solar_radiation"] = `${weatherData.solar_rad} W/m²`;
  result["sources"] = weatherData.sources;
  result["state"] = weatherData.state_code;
  result["weather_station"] = weatherData.station;
  result["sunrise"] = weatherData.sunrise;
  result["sunset"] = weatherData.sunset;
  result["temperature"] = `${Math.round(
    celsiusToFahrenheit(weatherData.temp)
  )} °F`;
  result["timezone"] = weatherData.timezone;
  result["unix_timestamp"] = weatherData.ts;
  result["uv_index"] = weatherData.uv;
  result["visibility"] = `${centimetersToInches(weatherData.vis)} in`;
  result["weather_description"] = weatherData.weather.description;
  result[
    "wind_direction"
  ] = `${weatherData.wind_dir}° ${weatherData.wind_cdir_full}`;
  result["wind_speed"] = `${msToMph(weatherData.wind_spd)} mph`;
  return result;
};

module.exports = {
  getCurrentWeatherData,
  createDummyWeatherData,
};
