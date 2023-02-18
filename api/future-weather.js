const axios = require("axios");
const { withCache } = require("../utils/with-cache");

const axiosInstance = axios.create({
  baseURL: "https://api.weatherbit.io/v2.0/",
  method: "get",
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

const apiKey = "47b4b166bf68465eb7c4695bd5f4e6f5";

/**
 *
 * @param {number} latitude
 * @param {number} longitude
 */
const getFutureWeatherData = async (latitude, longitude) =>
  withCache(`future-weather-${latitude},${longitude}`, async () => {
    const response = await axiosInstance.get(
      `forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}`
    );
    return transformData(response.data.data[0]);
  });

const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

const transformData = (weatherData) => {
  const result = {};
  result["feels_like"] = `${Math.round(
    celsiusToFahrenheit(weatherData.app_temp)
  )} °F`;
  result["air_quality_index"] = weatherData.aqi;
  result["city"] = weatherData.city_name;
  result["cloud_cover"] = `${weatherData.clouds}%`;
  result["country"] = weatherData.country_code;
  result["date_time"] = weatherData.datetime;
  result["dew_point"] = `${Math.round(
    celsiusToFahrenheit(weatherData.dewpt)
  )} °F`;
  result["direct_horizontal_irradiance"] = weatherData.dhi;
  result["direct_normal_irradiance"] = weatherData.dni;
  result["elevation_angle"] = `${weatherData.elev_angle}°`;
  result["global_horizontal_irradiance"] = weatherData.ghi;
  result["max_wind_gust_speed"] = `${weatherData.gust} m/s`;
  result["latitude"] = weatherData.lat;
  result["longitude"] = weatherData.lon;
  result["observation_time"] = weatherData.ob_time;
  result["part_of_day"] = weatherData.pod === "n" ? "Night" : "Day";
  result["precipitation"] = `${weatherData.precip} mm`;
  result["pressure"] = `${weatherData.pres} hPa`;
  result["relative_humidity"] = `${weatherData.rh}%`;
  result["sea_level_pressure"] = `${weatherData.slp} hPa`;
  result["snowfall"] = `${weatherData.snow} cm`;
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
  result["visibility"] = `${weatherData.vis} km`;
  result["weather_description"] = weatherData.weather.description;
  result[
    "wind_direction"
  ] = `${weatherData.wind_dir}° ${weatherData.wind_cdir_full}`;
  result["wind_speed"] = `${weatherData.wind_spd} m/s`;
  return result;
};

module.exports = {
  getFutureWeatherData,
};
